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

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  document
    .getElementById("login")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const login = event.target.email.value;
      const password = event.target.password.value;

      firebase
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(({ user }) => {
          return user.getIdToken().then((idToken) => {
            return fetch("/sessionLogin", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN")
              },
              body: JSON.stringify({ idToken }),
            });
          });
        })
        .then(() => {
          window.location.assign("/dashboard");
        });
      return false;
    });
});