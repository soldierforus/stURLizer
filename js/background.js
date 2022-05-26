//initiate service worker & context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Service Worker Active'); 
  chrome.contextMenus.create({
    "title": 'Copy this link to clipboard',
    "contexts": ["link"],
    "id": "linkToClipboard"
  });
  chrome.contextMenus.create({
    "title": 'Open this link in a new tab',
    "contexts": ["link"],
    "id": "linkToTab"
  });
  chrome.contextMenus.create({
    "title": 'Copy this page URL to clipboard',
    "contexts": ["page"],
    "id": "pageToClipboard"
  });
});

function getSterilizedUrl(url) { 
  //get the current url and remove the params
  let diseasedUrl = '';
  let sterilizedUrl = '';
  
  diseasedUrl = url;
  sterilizedUrl = diseasedUrl.split('?')[0];
  return sterilizedUrl
}

function copyToClipboard(sterilizedUrl) {
  //create the data to be written to the the clipboard
  const type = "text/plain";
  const blob = new Blob([sterilizedUrl], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  
  //write to the clipboard
  navigator.clipboard.write(data);
}

// inject content.js when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/content.js']
  });
});
  
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "linkToClipboard":
      //send message to linkToClipboard,js with the link url
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
        {
            message: "copyText",
            textToCopy: info.linkUrl 
        }, function(response) {})
      })
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['js/linkToClipboard.js']
      });
    break;
    case "linkToTab":
      getSterilizedUrl(info.linkUrl);
      chrome.tabs.create({  
        url: getSterilizedUrl(info.linkUrl)
      });
    break;
    case "pageToClipboard":
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['js/content.js']
      });
    break;
  }
})