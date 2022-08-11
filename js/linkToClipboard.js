//listen for link url
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "copyText") {
          //sterilize the link that was copied
          let diseasedUrl = request.textToCopy;
          let sterilizedUrl = '';

            //operate on fb links
            if ( diseasedUrl.startsWith('https://l.facebook.com')) {
              sterilizedUrl = decodeURIComponent(diseasedUrl.substring(diseasedUrl.indexOf('https%'), diseasedUrl.indexOf('utm')));
            } else {
              sterilizedUrl = diseasedUrl.split('?')[0];
            }
          copyToClipboard(sterilizedUrl);
        }
    }
);

//create the data to be written to the the clipboard
async function copyToClipboard(sterilizedUrl) {
  const type = "text/plain";
  const blob = new Blob([sterilizedUrl], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  
  //write to the clipboard
  navigator.clipboard.write(data);
}