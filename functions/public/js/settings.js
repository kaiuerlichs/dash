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
    const db = firebase.firestore()

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            document
                .getElementById("settings")
                .addEventListener("submit", (event) => {
                    event.preventDefault();
                    const dundeeId = event.target.dundeeId.value;

                    db.collection("users").doc(uid).set({
                        dundeeId: dundeeId
                    }, { merge: true })
                        .then(() => {
                            alert("Sucessfully saved settings")
                        })
                        .catch((err) => {
                            alert("Something did not work :(")
                        })
                });
        } else {
            window.location.assign("/")
        }
    });
});