//listen for link url
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "copyText")
        copyToClipboard(request.textToCopy);
    }
);

//get the current url and remove the params
async function getSterilizedUrl(url) { 
  let diseasedUrl = '';
  let sterilizedUrl = '';
  
  diseasedUrl = url;
  sterilizedUrl = diseasedUrl.split('?')[0];
  return sterilizedUrl
}

//create the data to be written to the the clipboard
async function copyToClipboard(sterilizedUrl) {
  const type = "text/plain";
  const blob = new Blob([sterilizedUrl], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  
  //write to the clipboard
  navigator.clipboard.write(data);
}