chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
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
        data: { title: title, code: codeArray },
      });
    }
  });
});
