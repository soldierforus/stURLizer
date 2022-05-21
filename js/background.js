//initiate service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Service Worker Active');
});

// background.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/content.js']
  });
});