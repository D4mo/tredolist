
function loadSettings(boardId, defaultId=undefined) {
    chrome.storage.sync.get([boardId], function(result) {
        var configObj = result[boardId];
        if (configObj) {
            document.querySelector('#layout input[value="'+configObj.layout+'"]').checked = true;
            document.querySelector('#coloring input[value="'+configObj.coloring+'"]').checked = true;
        }
        else if (defaultId)
            loadSettings(defaultId);
    });
}

function saveSettings(boardId) {
    chrome.storage.sync.set({[boardId]: {
        layout: document.querySelector('#layout input:checked').value,
        coloring: document.querySelector('#coloring input:checked').value
    }});
}

function setupPage(tab) {
    var matches = tab.url.match(/^.*:\/\/trello\.com\/b\/(.*)\/(.*)/);
    if (matches && matches.length > 1) {
        var boardId = matches[1];

        // Try load settings
        loadSettings(boardId, '*');

        // Display board name
        var boardName = matches[2];
        var sep = boardName.indexOf('?');
        if (sep !== -1)
            boardName = boardName.substr(0, sep);
        document.getElementById('trelloBoardName').innerHTML = boardName;

        // On radio item changed
        document.onchange = function(e) {
            var tgt = e ? e.target : window.event.srcElement;
            if (tgt.nodeName.toLowerCase() === 'input' && tgt.type === 'radio' ) {
                saveSettings(boardId);
                return;
            }
        }

        // On "Set as Default" button clicked
        document.onclick = function(e) {
            var tgt = e ? e.target : window.event.srcElement;
            if (tgt.nodeName.toLowerCase() === 'button' && tgt.id === 'setDefault') {
                saveSettings('*');
                return;
            }
        }
    }
}

// On click on the Extension Button
chrome.tabs.query({'active': true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
    if (tabs && tabs.length > 0)
        setupPage(tabs[0]);
});

// On active URL change
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url && tab.active && tab.windowId === chrome.windows.WINDOW_ID_CURRENT)
        setupPage(tab);
});
