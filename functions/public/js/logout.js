window.addEventListener("DOMContentLoaded", () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAE-MFd_cFwnNiXVJfNtNR6Mhb9aXJerL4",
        authDomain: "dash-b4b17.firebaseapp.com",
        projectId: "dash-b4b17",
        storageBucket: "dash-b4b17.appspot.com",
        messagingSenderId: "418978064950",
        appId: "1:418978064950:web:90aea5ce8a26d6fce04697",
        measurementId: "G-Y3NK8LHX6E"
    };

  firebase.initializeApp(firebaseConfig);

  firebase.auth().signOut()
  .then(() => {
      window.location.assign("/")
  })
});