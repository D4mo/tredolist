if (board.classList.contains(classMixed)) {
  board.classList.remove(classMixed);
  board.classList.add(classVertical);
  chrome.storage.sync.set({'classList': classVertical});
} else if (board.classList.contains(classVertical)) {
  board.classList.remove(classVertical);
  board.classList.add(classHorizontalCardLayout);
  chrome.storage.sync.set({'classList': classHorizontalCardLayout});
}
else if (board.classList.contains(classHorizontalCardLayout)) {
  board.classList.remove(classHorizontalCardLayout);
  chrome.storage.sync.remove('classList');
} else {
  board.classList.add(classMixed);
  chrome.storage.sync.set({'classList': classMixed});
}
