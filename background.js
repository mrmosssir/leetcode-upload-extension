// window.onload = () => {
//   let head = document.getElementsByTagName("head")[0];
//   let script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = "https://apis.google.com/js/api.js";
//   head.appendChild(script);
// 
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background message");
  switch (message.methods) {
    case "get-list":
      chrome.identity.getAuthToken({
        interactive: true
      }, (token) => {
        let xhr = new XMLHttpRequest();
        console.log("done");
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
              console.log(this.response.files);
                sendResponse({ files: this.response.files });
            } else if (this.readyState === 4 && this.status !== 200) {
              console.log(this);
            }
        };

        xhr.open('GET', 'https://www.googleapis.com/drive/v3/files?q="root" in parents', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.responseType = 'json';
        xhr.send();
      })
      break;
    case "send-backup":

      let data = message.data;
      let title = data.title;
      let code = "";
      data.code.forEach((item) => {
        code += `${item}\n`;
      });
      console.log(message);
      chrome.identity.getAuthToken({
        interactive: true
      }, (token) => {
        console.log(message.id);
        let metadata = {
          name: `${title}.js`,
          mimeType: 'text/javascript',
          parents: [message.id],
        };

        let file = new Blob([code], {
          type: 'text/javascript'
        });
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {
          type: 'application/json'
        }));
        form.append('file', file);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.responseType = 'json';

        xhr.send(form);
      });
      break;
  }
  return true;
});