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
            var timetable_button = document.getElementById("timetable")

            var setup = db.collection("users").doc(uid)
            setup.get().then((doc) => {
                if(doc.exists){
                    if(
                        doc.data().dundeeId == null
                    ){
                        window.location.assign("/settings")
                    }
                    else{
                        timetable_button.setAttribute("href", "/timetable/" + doc.data().dundeeId)
                    }
                }
                else{
                    window.location.assign("/settings")
                }
            })

        } else {

            alert("Something went wrong. You will be logged out.")
            window.location.assign("/sessionLogout")

        }
    });
})