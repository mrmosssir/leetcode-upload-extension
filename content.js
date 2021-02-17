chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  console.log("content");
  
  if (message.methods === "call-backup") {
    let title = document.querySelector('div[data-cy="question-title"]')
      .textContent;
    let codes = document.querySelectorAll('span[role="presentation"]');
    let codeArray = [];
    codes.forEach((code) => {
      codeArray.push(code.textContent);
    });
    chrome.runtime.sendMessage({
      methods: "send-backup",
      data: {
        id: message.id,
        title: title,
        code: codeArray
      },
    });
  }
  return true;
});