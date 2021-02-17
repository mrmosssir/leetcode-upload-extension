let btnUpload = document.querySelector(".btn-upload");
let btnFolderList = document.querySelector('.btn-folder-list');
let btnFolderChange = document.querySelector('.btn-folder-change');
let btnFolderCreate = document.querySelector('.btn-folder-create');
let btnFolderSubmit = document.querySelector('.btn-folder-submit');
let btnFolderCancel = document.querySelector('.btn-folder-cancel');

let textTarget = document.querySelector('.text-target');
let textFolderName = document.querySelector('.folder-form input');

let list = document.querySelector('.list');

let folderForm = document.querySelector('.folder-form');

window.onload = () => {
  chrome.storage.sync.get(['folder_id', 'folder_name'], (result) => {
    if (result.folder_id === undefined && result.folder_name === undefined ||
      result.folder_id === '' && result.folder_name === '') {
    btnFolderChange.style.display = 'none';
      chrome.runtime.sendMessage({ methods: "get-list" }, (response) => {
        let str = '';
        let folders = response.files.filter((item) => {
          return item.mimeType === "application/vnd.google-apps.folder";
        });
        folders.forEach(folder => {
          str += `<button data-id="${folder.id}"><i class="far fa-folder-open"></i>${folder.name}</button>`
        });
        btnFolderList.innerHTML = `<div class="btn-folder-list">${str}<div>`;
      });
    } else {
      textTarget.innerText = `Target：${result.folder_name}`;
    btnFolderChange.style.display = 'block';
      list.style.display = 'none';
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch(message.methods) {
    case 'response-message':
      alert(message.message);
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if(changeInfo.status == "loading") {
    chrome.tabs.executeScript({ file: "content.js" });
  }
});

btnFolderList.addEventListener("click", (e) => {
  chrome.storage.sync.set({ folder_id: e.target.dataset.id, folder_name: e.target.innerText });
  window.location.reload();
})

btnFolderChange.addEventListener("click", (e) => {
  chrome.storage.sync.set({ folder_id: '', folder_name: '' });
  window.location.reload();
})

btnFolderCreate.addEventListener("click", (e) => {
  btnFolderCreate.style.display = 'none';
  folderForm.style.display = 'flex';
})

btnFolderCancel.addEventListener("click", (e) => {
  btnFolderCreate.style.display = 'block';
  folderForm.style.display = 'none';
})

btnFolderSubmit.addEventListener("click", (e) => {
  let folderName = textFolderName.value;
  console.log(folderName);
  window.location.reload();
})

btnUpload.addEventListener("click", (e) => {
  chrome.storage.sync.get(['folder_id'], (result) => {
    if (result.folder_id === undefined || result.folder_id === '') {
      alert("Not Select Google Drive Path");
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { methods: "call-backup", id: result.folder_id });
      });
    }
  })
});