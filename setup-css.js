
// Utilities

function insertCss(cssFile, id) {
  if (document.getElementById(id) === null) {
    var css = document.createElement('link');
    css.id = id;
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = cssFile;
    document.getElementsByTagName('head')[0].appendChild(css);
  }
}

function findStylesheet(token) {
  var currentCssArray = document.querySelectorAll('link[rel=stylesheet]');
  var i;
  for (i=0; i<currentCssArray.length; ++i) {
      var styleSh = currentCssArray[i];
      if (styleSh.getAttribute('href').lastIndexOf(token) !== -1)
          return styleSh;
  }
  return null;
}

function switchStylesheet(styleSh, newShortFilename) {
  var href = styleSh.getAttribute('href');
  var sflnPos = href.lastIndexOf('/') + 1;
  if (sflnPos == 0)
      return;
  href = href.substr(0, sflnPos) + newShortFilename;
  styleSh.setAttribute('href', href);
}

function setNewStylesheet(cssToReplace, newCss) {
  var styleSh = findStylesheet(cssToReplace);
  if (styleSh !== null)
    switchStylesheet(styleSh, newCss);
  else
    insertCss(chrome.extension.getURL("css/"+newCss));
}

function catchNodeByClass(className, callback) {
  var nodes = document.getElementsByClassName(className);
  for (var node of nodes) {
    callback(node);
  }
}

function getParent(node, selector) {
  for (var p = node && node.parentElement; p; p = p.parentElement) {
    if (p.matches(selector))
      return p;
  }
  return null;
}

function loadSettings(boardId, defaultId=undefined) {
  chrome.storage.sync.get([boardId], function(result) {
      var configObj = result[boardId];
      if (configObj) {
          document.querySelector('#layout [value='+configObj.layout+'}').checked = true;
          document.querySelector('#coloring [value='+configObj.coloring+'}').checked = true;
      }
      else if (defaultId)
          loadSettings(defaultId);
  });
}

function getBoardId() {
  var matches = window.location.href.match(/^.*:\/\/trello\.com\/b\/(.*)\/.*/);
  if (! (matches && matches.length > 1))
    return null;
  return matches[1];
}

// Main logic

var board = document.getElementById('board');
var layouts = ['vertical', 'mixed', 'horizcards'];

function setLayout(layoutName) {
  if (!board.classList)
    return;
  board.classList.add('layout-trello-'+layoutName);
  for (var layout of layouts) {
    if (layout !== layoutName)
      board.classList.remove('layout-trello-'+layout);
  }
}

insertCss(chrome.extension.getURL('css/layout.css'), 'layoutcss');

var configObj = {
  layout: '',
  coloring: ''
};
var hasSpecificConfig = false;
var boardId = getBoardId();
var defaultSettingKey = '*';

function onSettingChanged(key, newConfigObj) {
  if (key === boardId) {
    hasSpecificConfig = true;
    //console.log("Tredolist: loading page-specific settings for "+key);
    //console.log(newConfigObj);
  }
  else if ((key !== defaultSettingKey) || hasSpecificConfig)
    return;
  //else
  //  console.log("Tredolist: loading default settings");
  
  for (var configKey in configObj) {
    if (newConfigObj[configKey] !== configObj[configKey]) {
      switch (configKey) {
        case 'layout':
          setLayout(newConfigObj[configKey]);
          break;
        case 'coloring':
          setNewStylesheet(
            'theme-'+configObj[configKey]+'.css',
            'theme-'+newConfigObj[configKey]+'.css');
        break;
      }
      configObj[configKey] = newConfigObj[configKey];
    }
  }
}

// Load settings
chrome.storage.sync.get([boardId], function(result) {
  if (result[boardId])
    onSettingChanged(boardId, result[boardId]);
  else {
    chrome.storage.sync.get([defaultSettingKey], function(resultD) {
      if (resultD[defaultSettingKey])
        onSettingChanged((defaultSettingKey), resultD[defaultSettingKey]);
    });
  }
});
chrome.storage.onChanged.addListener(function(changes, areaName) {
  for (key in changes) {
    onSettingChanged(key, changes[key].newValue);
  }
});

var States = ['canceled-tdl', 'done-tdl', 'for-later-tdl', 'waiting-for-tdl', 'in-progress-tdl']; // in order of priority
var Fields = ['Canceled', 'Done', 'For Later', 'Waiting For', 'Started'];

function getStateFromBadgeText(node) {
  if (!node)
    return undefined;

  // Using custom fields
  for (var iState in Fields) {
    if (node.innerText === Fields[iState])
      return States[iState];
  }

  // Using checklist
  var toks = node.innerText.match(/^(\d+)\/(\d+)$/);
  if (toks && toks.length > 2) {
    var numDone = toks[1];
    var numTodo = toks[2];
    if (numDone === numTodo)
      return 'done-tdl';
    else if (numDone > 0)
      return 'in-progress-tdl';
    else
      return 'not-started-tdl';
  }
  return undefined;
}

function getStateFromTitle(node) {
  if (node && node.innerText) {
    if (node.innerText.match(/^\(.*\)$/) !== null)
      return 'for-later-tdl';
    if (node.innerText.match(/\<.*\>/) !== null)
      return 'waiting-for-tdl';
  }
  return undefined;
}

function getMainState(compoundStates) {
  for (var st of States) {
    if (compoundStates.indexOf(st) !== -1) {
      return st;
    }
  }
  return undefined;
}

function setState(card, state) {
  if (!card.classList)
    return;
  for (var st of States) {
    card.classList.toggle(st, (st === state));
  }
}

function updateColor(listCardNode) {
  // Look at badge text
  var badgeTextNodes = listCardNode.querySelectorAll('.badge-text');
  var compoundStates = Array.from(badgeTextNodes).map(function(badgeTextNode) {
    return getStateFromBadgeText(badgeTextNode);
  });

  // Look at title
  var titleState = getStateFromTitle(listCardNode.querySelector('.list-card-title'));
  if (titleState !== undefined)
    compoundStates.push(titleState);

  // Resolve according to priority
  var mainState = getMainState(compoundStates);
  setState(listCardNode, mainState);

  // Set additional class if having a short or past deadline
  var iconClockNode = listCardNode.querySelector('.badge.is-due-soon') || listCardNode.querySelector('.badge.is-due-now') || listCardNode.querySelector('.badge.is-due-past');
  if (listCardNode.classList)
    listCardNode.classList.toggle('urgent-tdl', iconClockNode !== null && (mainState !== 'canceled-tdl'));
}

catchNodeByClass('list-card', updateColor);

// Make sure we catch late asynchronous badge changes
var classesToObserve = [{className: 'badge', callback: function(node) {
  var listCardNode = getParent(node, '.list-card');
  if (listCardNode)
    updateColor(listCardNode);
}}];


var rootNode = document.getElementsByClassName('board-canvas');
if (rootNode) {
  rootNode = rootNode[0];
  var callback = function(mutations) {
    for(var mutation of mutations) {
      switch (mutation.type) {
        case 'childList':
          mutation.addedNodes.forEach(function(node, iNode, nodes) {
            if (!node.classList)
              return;
            classesToObserve.forEach(function(obj) {
              if (node.classList.contains(obj.className))
                obj.callback(node);
            });
          });
        default: ;
      }
    }
  };
  var observer = new MutationObserver(callback);
  observer.observe(rootNode, {childList: true, subtree: true});
}