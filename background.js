// Send selection text to script when menu option clicked
function showCourse(args) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.tabs.sendMessage(tab.id, {
      selection: args.selectionText,
    });
  })();
}

chrome.contextMenus.removeAll();

// Create option after signal from selection.js that selection is a course name
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.courseName) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "1",
        title: "View course preview for " + msg.courseName,
        contexts: ["selection"],
      });
    });
  } else {
    chrome.contextMenus.removeAll();
  }
});

chrome.contextMenus.onClicked.addListener(showCourse);
