// Require necessary modules and execute express
const express = require("express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const admin = require("firebase-admin");
const csrf = require("csurf")
const path = require("path")
const functions = require("firebase-functions")
const timetable = require("./modules/timetable")
require("dotenv").config();

// Connect to Firebase Admin API
const serviceAccount = require(path.join(__dirname, "/firebaseAdminKey.json"));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Initiate Express
const app = express();

// Set public directory, templating engine and views path
app.use(express.static(path.join(__dirname, "/public")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

// Initiate middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrf({ cookie: true }))

// Custom middleware to add XSRF Token to Requests
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken())
    next()
})

app.get("/", (req, res) => {
    const sessionCookie = req.cookies.__session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.redirect("/dashboard");
        })
        .catch((error) => {
            res.render("login");
        });
})

app.get("/dashboard", (req, res) => {
    const sessionCookie = req.cookies.__session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.render("dashboard");
            console.log(req.user)
        })
        .catch((error) => {
            res.redirect("/");
        });
})

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.setHeader('Cache-Control', 'private');
                res.cookie("__session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("Request is not authorised.");
            }
        );
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("__session");
    res.render("logout");
});

app.get("/timetable/:id/:week?", (req, res) => {
    const sessionCookie = req.cookies.__session || ""
    const id = req.params.id
    const week = req.params.week

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {

            timetable.getTimetable(id, week)
            .then(result => {
                res.render("timetable", result)
            })
            .catch(err => {
                res.redirect("/")
            })
        })
        .catch((error) => {
            res.redirect("/");
        });
})

app.get("/settings", (req, res) => {
    const sessionCookie = req.cookies.__session || ""

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            res.render("settings")
        })
        .catch((error) => {
            res.redirect("/");
        });
})

exports.app = functions.https.onRequest(app)