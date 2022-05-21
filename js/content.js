//get the current url and remove the params
let diseasedURL = window.location.href;
let sterilizedURL = diseasedURL.split('?')[0];

//create the data to be written to the the clipboard
const type = "text/plain";
const blob = new Blob([sterilizedURL], { type });
const data = [new ClipboardItem({ [type]: blob })];

//write to the clipboard
navigator.clipboard.write(data);