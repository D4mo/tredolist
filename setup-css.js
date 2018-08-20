
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

catchNodeByClass('list-card', function(listCardNode) {
  // Look at badges
  var badgeTextNodes = listCardNode.querySelectorAll('.badge-text');
  var compoundStates = Array.from(badgeTextNodes).map(function(badgeTextNode) {
    return getStateFromBadgeText(badgeTextNode);
  });

  // Look at title
  compoundStates.push(getStateFromTitle(listCardNode.querySelector('.list-card-title')));

  // Resolve according to priority
  setState(listCardNode, getMainState(compoundStates));
});