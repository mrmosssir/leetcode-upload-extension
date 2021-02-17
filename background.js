chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.methods) {
    case "get-list":
      chrome.identity.getAuthToken({
        interactive: true
      }, (token) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
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
      chrome.identity.getAuthToken({
        interactive: true
      }, (token) => {
        let metadata = {
          name: `${title}.js`,
          mimeType: 'text/javascript',
          parents: [message.data.id],
        };
        let file = new Blob([code], {
          type: 'text/javascript'
        });
        let form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {
          type: 'application/json'
        }));
        form.append('file', file);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.responseType = 'json';
        try {
          xhr.send(form);
          chrome.runtime.sendMessage({ methods: 'response-message', success: true, message: 'Leetcode Backup Success' });
        } catch (error) {
          chrome.runtime.sendMessage({ methods: 'response-message', success: false, message: error });
        }
      });
      break;
    case "create-folder":
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        let form = new FormData();
        let metadata = {
          name: message.name,
          mimeType: "application/vnd.google-apps.folder"
        };
        form.append('metadata', new Blob([JSON.stringify(metadata)], {
          type: 'application/json'
        }));
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.responseType = 'json';
        try {
          xhr.send(form);
          chrome.runtime.sendMessage({ methods: 'response-message', success: true, message: 'Google Drive Folder Create Success' });
        } catch (error) {
          chrome.runtime.sendMessage({ methods: 'response-message', success: false, message: error });
        }
      })
      break;
  }
  return true;
});