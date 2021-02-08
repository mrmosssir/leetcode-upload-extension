chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.methods === "send-backup") {
    let data = message.data;
    let title = data.title;
    let code = "";
    data.code.forEach((item) => {
      code += `${item}\n`;
    });
    chrome.identity.getAuthToken({interactive: true}, (token) => {
      console.log('got the token', token);
      let metadata = {
        name: `${title}.js`,
        mimeType: 'text/javascript',
        parents: ['1cNG5q7Wzv_deLgHFUcHkWcq-LV9P2k-p'],
      };
      let file = new Blob([code], {type: 'text/javascript'});
      var form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      form.append('file', file);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.responseType = 'json';
      xhr.onload = () => {
          console.log(xhr.response);
      };
      xhr.send(form);
    })
  }
});