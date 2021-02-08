let btn = document.querySelector("#btn");


btn.addEventListener("click", (e) => {
  chrome.tabs.executeScript(null, { file: "content.js" }, () => {
    connect();
  });
});

function connect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ methods: "call-backup" });
    port.onMessage.addListener((response) => {
      alert(response.title);
    });
  });
}