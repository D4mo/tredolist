
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

function getParent(node, selector) {
  for (var p = node && node.parentElement; p; p = p.parentElement) {
    if (p.matches(selector))
      return p;
  }
  return null;
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

function getStateFromBadgeText(node) {
  switch (node.innerText) {
    case 'Canceled':
      return 'canceled-tdl';
    case 'Done':
      return 'done-tdl';
    case 'Started':
      return 'in-progress-tdl';
    case undefined:
      return undefined;
    default:
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
}

var States = ['canceled-tdl', 'done-tdl', 'in-progress-tdl'];

function setState(card, state) {
  for (var st of States) {
    card.classList.toggle(st, (st === state));
  }
}

catchNodeByClass('badges', function(badgesNode) {
  var badgeTextNodes = badgesNode.querySelectorAll('.badge-text');
  var compoundStates = Array.from(badgeTextNodes).map(function(badgeTextNode) {
    return getStateFromBadgeText(badgeTextNode);
  });

  // Handle priority of states
  var state = undefined;
  if (compoundStates.indexOf('canceled-tdl') !== -1)
    state = 'canceled-tdl';
  else if (compoundStates.indexOf('done-tdl') !== -1)
    state = 'done-tdl';
  else
    state = compoundStates.find(function(st) { return st !== undefined; });
  
  setState(getParent(badgesNode, '.list-card'), state);
});
