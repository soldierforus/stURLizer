//listen for link url
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "copyText") {
          //sterilize the link that was copied
          let diseasedUrl = request.textToCopy;
          let sterilizedUrl = '';
         
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
        else if (diseasedUrl.includes('https://') || diseasedUrl.includes('http://') && !diseasedUrl.includes('utm')) {
          sterilizedUrl = diseasedUrl
        }
                
        else {
          alert("Sorry, This link cannot be stURLized.")
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