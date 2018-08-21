
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

// Main logic

var cssFile = chrome.extension.getURL('css/layout.css'),
  board = document.getElementById('board'),
  classVertical = 'layout-trello-vertical',
  classMixed = 'layout-trello-mixed',
  classHorizontalCardLayout = 'layout-trello-horizcards';
insertCss(cssFile, 'layoutcss');
var colorThemeCssFile = chrome.extension.getURL('css/theme-bright.css');
insertCss(colorThemeCssFile, 'tredolist-themecss')

chrome.storage.sync.get('classList', function (result) {
  if (result.classList) {
    board.classList.add(result.classList);
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
  setState(listCardNode, getMainState(compoundStates));

  // Set additional class if having a short or past deadline
  var iconClockNode = listCardNode.querySelector('.badge.is-due-soon') || listCardNode.querySelector('.badge.is-due-now') || listCardNode.querySelector('.badge.is-due-past')
  listCardNode.classList.toggle('urgent-tdl', iconClockNode !== null);
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