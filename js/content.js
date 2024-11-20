(() => {
  //get the current url and remove the params
  let diseasedURL = ''
  let sterilizedURL = ''

    //get the current url and remove the params
    diseasedURL = window.location.href;
    sterilizedURL = diseasedURL.split('?')[0];
    diseasedURL = '';
    
    //create the data to be written to the the clipboard
    const type = "text/plain";
    const blob = new Blob([sterilizedURL], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    
    //write to the clipboard
    navigator.clipboard.write(data).then(function(x) {
      chrome.runtime.sendMessage({ action: "changeIcon" });
    });
})();