require('dotenv').config();

const {
    connector
} = require('./database/config/dbConfig');
const Diary = require('./database/models/Diary')

const Group = require('./database/models/Group')
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');

const port = process.env.PORT || 3001;
const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middlewares
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

// Custom middleware
let isGroupLoggedIn = (req, res, next) => {
    if (req.session.user && req.cookies.authCookie) {
        res.redirect('/profile')
    } else {
        next();
    }
}

// GET route for landing page. Check middleware isUserLoggedIn, if yes, show profile, if no, follow logic to index
app.get('/', isGroupLoggedIn, (req, res) => {
    console.log('The group session on arrival: ', req.session)
    res.render('index');
});

app.get('/register', isGroupLoggedIn, (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    Group.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(results => {
            req.session.group = results.dataValues;
            console.log('Group session after resgistration: ', req.session.group);
            res.redirect('/profile');
        })
        .catch(error => {
            console.error(`Cannot create group ${error.stack}`)
        })
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', (req, res) => {
    Group.findOne({
            where: {
                name: req.body.username
            }
        })
        .then(foundGroup => {
            if (req.body.username !== null && foundGroup) {
                req.session.group = foundGroup.dataValues;
                res.redirect('/profile');
            } else {
                console.log('Something went wrong when logging in')
                res.redirect('/login');
            }
        })
        .catch(error => console.error(`Could not log in ${error.stack}`))
})

app.get('/profile', (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render('profile')
    } else {
        res.redirect('/login')
    }
})

// GET route for logout and clear out cookies
app.get('/profile/logout', (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.clearCookie('authCookie');
        res.redirect('/');
    } else {
        res.redirect('login')
    }
})

app.get('/profile/breath', (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render('breath')
    } else {
        res.redirect('/login')
    }
})

app.get('/profile/write', (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render('write')
    } else {
        res.redirect('/login')
    }
})

app.get('/profile/results', (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        Diary.findAll({
            where: {
                groupId: req.session.group.id
            }
        }).then(allPost => {
            let allMessages = allPost.map(postElement => {
                return {
                    body: postElement.dataValues.body,
                    createdAt: postElement.dataValues.createdAt
                }
            })
            console.log("ALL POSTS", allMessages)
            res.render('results', {
                newMessage: allMessages
            })
        }).catch(error => console.log("Something went wrong", error.stack))
    } else {
        res.redirect('/login')
    }
})

app.post('/profile/results', (req, res) => {
    Diary.create({
            body: req.body.body,
            groupId: req.session.group.id
        })
        .then(results => {
            Diary.findAll({
                where: {
                    groupId: req.session.group.id
                }
            }).then(allPost => {
                let allMessages = allPost.map(postElement => {
                    return {
                        body: postElement.dataValues.body,
                        createdAt: postElement.dataValues.createdAt
                    }
                })
                console.log("ALL POSTS", allMessages)
                res.render('results', {
                    newMessage: allMessages
                })
            }).catch(error => console.log("Something went wrong", error.stack))

        })
        .catch(error => console.error(`Cannot create diaries ${error.stack}`))
});

// Synchronize a connect to database and start express server
connector
    .sync()
    .then(() => {
        app.listen(port, () => console.log(`Listening to port ${port}`));
    })
    .catch(error => console.log(`Could not sync with databse ${error.stack}`))