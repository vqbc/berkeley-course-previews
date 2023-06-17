function showCourse(args) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      selection: args.selectionText,
    });
  })();
}

chrome.contextMenus.removeAll();

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "selection");
  port.onMessage.addListener(function (msg) {
    if (msg.courseName) {
      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          id: "1",
          title: "View course preview for %s",
          contexts: ["selection"],
        });
      });
    } else {
      chrome.contextMenus.removeAll();
    }
  });
});

chrome.contextMenus.onClicked.addListener(showCourse);
