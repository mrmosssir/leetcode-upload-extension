var GoogleAuth;

var client_id =
  "451555466829-91vgcfitg3f5h70sv7h1547vi980a8n2.apps.googleusercontent.com";
var api_key = "AIzaSyDA4YJLziXW_Qrd8j544vQv_tvci1LxnAo";
var scope = "https://www.googleapis.com/auth/drive.metadata.readonly";

let btn = document.querySelector("#btn");
let loginBtn = document.querySelector("#btn-login");

let head = document.getElementsByTagName("head")[0];
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://apis.google.com/js/api.js";
head.appendChild(script);

btn.addEventListener("click", (e) => {
  chrome.tabs.executeScript(null, { file: "content.js" }, () => {
    connect();
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.methods) {
    case "send-backup":
      let data = message.data;
      let title = data.title;
      let code = "";
      data.code.forEach((item) => {
        code += `${item}\n`;
      });
      alert(`title : ${title}\ncode: ${code}`);
      break;
    // case "check-login":
    //   loginBtn.textContent = "logout";
    //   break;
    // case "check-logout":
    //   loginBtn.textContent = "login";
    //   break;
  }
});

window.onload = () => {
  handleClientLoad();
};

function connect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ methods: "call-backup" });
    port.onMessage.addListener((response) => {
      alert(response.title);
    });
  });
}

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  alert("enter");
  gapi.client
    .init({
      apiKey: api_key,
      clientId: client_id,
      scope: scope,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      ],
    })
    .then(
      () => {
        // Listen for sign-in state changes.
        GoogleAuth = gapi.auth2.getAuthInstance();
        // console.log(GoogleAuth);
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        let user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // if (message.methods === "send-backup") {
        //   let data = message.data;
        //   let title = data.title;
        //   let code = "";
        //   data.code.forEach((item) => {
        //     code += `${item}\n`;
        //   });
        //   console.log(`title : ${title}\ncode: ${code}`);
        //   // upload_google_drive();
        // }
        loginBtn.addEventListener("click", (e) => {
          handleAuthClick();
        });

        // console.log(message.methods);

        // if (message.methods === "test") {
        //   handleClientLoad();
        // }

        // Handle the initial sign-in state.
        // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        // authorizeButton.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        alert(error);
      }
    );
}

function handleAuthClick() {
  alert("done");
  GoogleAuth = gapi.auth2.getAuthInstance();
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked "Sign out" button.
    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(scope);
  alert(isAuthorized);
  if (isAuthorized) {
    // loginBtn.textContent = "logout";
    alert('logout');
  } else {
    // loginBtn.textContent = "login";
    alert('login');
  }
}

function updateSigninStatus() {
  setSigninStatus();
}
