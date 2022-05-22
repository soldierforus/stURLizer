//initiate service worker & context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Service Worker Active');
  
  chrome.contextMenus.create({
    "title": 'StURLize this link and copy to keyboard',
    "contexts": ["link"],
    "id": "myContextMenuId"
  });
});

// background.js
chrome.action.onClicked.addListener((tab) => {
  console.log("hit");
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/content.js']
  });
});
  
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/contextMenu.js']
  });
  // chrome.tabs.create({  
  //     url: "http://www.google.com/search?q=" + encodeURIComponent(info.selectionText)
  // });
})