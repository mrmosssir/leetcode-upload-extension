let btnUpload = document.querySelector(".btn-upload");
let btnFolderList = document.querySelector('.btn-folder-list');

let textTarget = document.querySelector('.text-target');

let list = document.querySelector('.list');

window.onload = () => {
  chrome.storage.sync.get(['folder_id', 'folder_name'], (result) => {
    if (result.folder_id === undefined && result.folder_name === undefined) {
      chrome.runtime.sendMessage({ methods: "get-list" }, (response) => {
        let str = '';
        let folders = response.files.filter((item) => {
          return item.mimeType === "application/vnd.google-apps.folder";
        });
        folders.forEach(folder => {
          str += `<button data-id="${folder.id}">${folder.name}</button>`
        });
        btnFolderList.innerHTML = `<div class="btn-folder-list">${str}<div>`;
      });
    } else {
      textTarget.innerText = `目標：${result.folder_name}`;
      list.style.display = 'none';
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if(changeInfo.status == "loading") {
    chrome.tabs.executeScript({ file: "content.js" });
  }
});

btnFolderList.addEventListener("click", (e) => {
  chrome.storage.sync.set({ folder_id: e.target.dataset.id, folder_name: e.target.innerText });
  window.location.reload();
})

btnUpload.addEventListener("click", (e) => {
  chrome.storage.sync.get(['folder_id'], (result) => {
    if (result.folder_id === undefined) {
      alert("Google Drive 目標資料夾未設定");
    } else {
      alert('done');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { methods: "call-backup", id: result.folder_id });
      });
    }
  })
});