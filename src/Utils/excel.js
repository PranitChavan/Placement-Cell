export default async function saveFile(fileName, data, mimeType, isBase64Content = true) {
  const formattedData = writeCsvFile(data);

  if (fileName && formattedData) {
    if (isAppleMobileWebkit()) {
      let webkitAppInterface = undefined;
      let webkit = window.webkit;
      if (webkit && webkit.messageHandlers && webkit.messageHandlers.AppInterface) {
        webkitAppInterface = webkit && webkit.messageHandlers && webkit.messageHandlers.AppInterface;
      }
      if (webkitAppInterface) {
        if (!openDocumentFinished || typeof openDocumentFinished !== 'function') {
          window.openDocumentFinished = placeHolderOnDocumentFinished;
        }
        if (!mimeType) mimeType = '';
        let request = {
          actionName: 'OpenDocument',
          header: fileName,
          body: { documentContent: formattedData, documentMimeType: mimeType },
        };
        webkitAppInterface.postMessage(request);
      }
    } else {
      let base64Content = isBase64Content ? base64ToArrayBuffer(formattedData) : formattedData;
      let url = createBlobUrl(base64Content, 'application/octet-stream');
      await downloadFile(url, fileName);
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }
  }
}

const writeCsvFile = (inputArray) => {
  if (inputArray && inputArray.length > 0) {
    let header = Object.keys(inputArray[0]);
    let headerString = header.join(',');
    let rowItems = inputArray.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName])).join(','));
    return [headerString, ...rowItems].join('\r\n');
  }
};

function isAppleMobileWebkit() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && /WebKit/.test(navigator.userAgent);
}

function base64ToArrayBuffer(base64) {
  let binaryString = atob(base64);
  let binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  binaryString = undefined;
  binaryLen = undefined;
  return bytes;
}

function createBlobUrl(data, typeInfo) {
  window.URL = window.URL || window.webkitURL;
  return window.URL.createObjectURL(new Blob([data], { type: typeInfo }));
}

function downloadFile(url, fileName) {
  return new Promise((resolve, reject) => {
    let link = document.createElement('a');
    link.style.setProperty('display', 'none');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    resolve();
  });
}
