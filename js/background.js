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

//listen for hotkey
chrome.commands.onCommand.addListener((command, tab) => {
  console.log(`Command "${command}" triggered`);
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/content.js']
  });
});

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
      //get the current url and remove the params
      function getSterilizedUrl(url) { 
        let diseasedUrl = '';
        let sterilizedUrl = '';
       
        diseasedUrl = url;
        
        if (diseasedUrl.includes('utm' && 'https:%')) {
          if (!diseasedUrl.startsWith('https://l.facebook.com')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('https:%'), diseasedUrl.indexOf('utm'))).split('?')[0];
          }
        }
        
        else if (!diseasedUrl.includes('utm') && diseasedUrl.includes('https:%')) {
          if (!diseasedUrl.startsWith('https://l.facebook.com')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('https:%')));
          }
        }
        
        //operate on fb links
        else if ( diseasedUrl.startsWith('https://l.facebook.com')) {
          if (diseasedUrl.includes('fbclid' && 'https%')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('https%'), diseasedUrl.indexOf('fbclid'))).split('?')[0];
          } else if (diseasedUrl.includes('utm' && 'https%')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('https%'), diseasedUrl.indexOf('utm'))).split('?')[0];
          } else if (diseasedUrl.includes('fbclid' && 'http%')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('http%'), diseasedUrl.indexOf('fbclid'))).split('?')[0];
          }
          else if (diseasedUrl.includes('utm' && 'http%')) {
            sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('http%'), diseasedUrl.indexOf('utm'))).split('?')[0];
          }
        }
         
        //no operation for links that are already clean
        else if ((diseasedUrl.includes('https://') && !diseasedUrl.includes('utm')) || (diseasedUrl.includes('http://') && !diseasedUrl.includes('utm'))) {
          sterilizedUrl = diseasedUrl.split('?')[0]
        }
        
        else {
          sterilizedUrl = '';
        }
        
        return sterilizedUrl
      }
     //open new tab using the sterilized link
     let sterilizedUrl = getSterilizedUrl(info.linkUrl);
     if(sterilizedUrl !== '' || undefined) {
       chrome.tabs.create({
          url: sterilizedUrl
       });
     } else {
      chrome.tabs.create({
        url: "sorry.html"
     });
    }
    break;
    case "pageToClipboard":
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['js/content.js']
      });
    break;
  }
})