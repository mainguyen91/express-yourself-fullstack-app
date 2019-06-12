require('dotenv').config();

const {
    connector
} = require('./database/config/dbConfig');

const getHome = require("./controllers/homeController");
const getProfile = require("./controllers/profileController");
const getLogout = require("./controllers/logoutController");
const {
    getRegistrationPage,
    postGroupRegistration
} = require("./controllers/registerController");
const {
    getLoginPage,
    postGroupLogin
} = require("./controllers/loginController");
const getBreath = require("./controllers/breathController");
const getWrite = require("./controllers/writeController");
const {
    getResults,
    postResults
} = require("./controllers/resultsController")

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const flash = require("express-flash");
const {
    check
} = require("express-validator/check");

const port = process.env.PORT || 3001;
const app = express();

app.set('view engine', 'ejs');

app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    name: process.env.SESSION_COOKIE,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(morgan('dev'));

let isGroupLoggedIn = (req, res, next) => {
    if (req.session.group && req.cookies.authCookie) {
        res.redirect('/profile')
    } else {
        next();
    }
}

app.get('/', isGroupLoggedIn, getHome);

app.get('/register', isGroupLoggedIn, isGroupLoggedIn, getRegistrationPage);

app.post('/register', [
        check("email")
        .isEmail()
        .withMessage(
            "Please use a proper email format like 'name@mailservice.com'!"
        ),
        check("username")
        .isAlphanumeric()
        .withMessage(
            "Sorry! Your username may only contain letters and/or numbers"
        ),
        check("password")
        .isLength({
            min: 3
        })
        .withMessage("Password must be at least 3 characters!")
    ],
    postGroupRegistration
);

app.get("/login", isGroupLoggedIn, getLoginPage);

app.post("/login", postGroupLogin);

app.get('/profile', getProfile);

app.get('/profile/logout', getLogout);

app.get('/profile/breath', getBreath);

app.get('/profile/write', getWrite);

app.get('/profile/results', getResults);

app.post('/profile/results', postResults);

connector
    .sync()
    .then(() => {
        app.listen(port, () => console.log(`Listening to port ${port}`));
    })
    .catch(error => console.log(`Could not sync with databse ${error.stack}`))