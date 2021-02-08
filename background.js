chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.methods === "send-backup") {
//     let data = message.data;
//     let title = data.title;
//     let code = "";
//     data.code.forEach((item) => {
//       code += `${item}\n`;
//     });
//     console.log(`title : ${title}\ncode: ${code}`);
//     // upload_google_drive();
//   }
//   if (message.methods === "send-login") {
//     handleAuthClick();
//     // console.log(message.methods);
//   }
  if (message.methods === "test") {
    handleClientLoad();
  }
});

var GoogleAuth;

let head = document.getElementsByTagName("head")[0];
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://apis.google.com/js/api.js";
head.appendChild(script);


function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  let client_id =
    "451555466829-5ktrvo3sfa9to64ofhr7leca2ja49kno.apps.googleusercontent.com";
  let api_key = "AIzaSyDA4YJLziXW_Qrd8j544vQv_tvci1LxnAo";
  let scope = "https://www.googleapis.com/auth/drive.metadata.readonly";
  gapi.client.init({
      'apiKey': api_key,
      'clientId': client_id,
      'scope': scope,
      'discoveryDocs': [
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      ],
    })
    .then(() => {
        // Listen for sign-in state changes.
        GoogleAuth = gapi.auth2.getAuthInstance();
        // console.log(GoogleAuth);
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        let user = GoogleAuth.currentUser.get();
        setSigninStatus();

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
            console.log(message);
            if (message.methods === "send-login") {
              handleAuthClick();
              // console.log(message.methods);
            }
            // if (message.methods === "test") {
            //   handleClientLoad();
            // }
          });

        // Handle the initial sign-in state.
        // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        // authorizeButton.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        console.log(error);
      }
    );
}

function handleAuthClick() {
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
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    chrome.runtime.sendMessage({
      methods: "check-login",
    });
  } else {
    chrome.runtime.sendMessage({
      methods: "check-logout",
    });
  }
}

function updateSigninStatus() {
  setSigninStatus();
}
