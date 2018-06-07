var express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Strategy = require('passport-discord').Strategy
    , app = express()
    , fs = require("fs");

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var scopes = ['bot', 'identify', 'email'];
var permissions = 268444722;
const config = require("./config.json");

passport.use(new Strategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/callback',
    scope: scopes,
    permissions: permissions
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        console.log("AccessToken: " + accessToken);
        console.log("RefreshToken: " + refreshToken);
        config.accessToken = accessToken;
        config.refreshToken = refreshToken;
        return fs.writeFile('config.json', JSON.stringify(config), 'utf8', () => done(null, profile));
        //return done(null, profile);
    });
}));

app.use(session({
    secret: 'qutopia',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', passport.authenticate('discord', { scope: scopes, permissions: permissions }), function (req, res) { });
app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }), function (req, res) { res.redirect('/info') } // auth success
);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function (req, res) {
    //console.log(req.user)
    res.json(req.user);
    setTimeout(() => process.exit(), 5000);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}


app.listen(5000, function (err) {
    if (err) return console.log(err)
    console.log('Listening at http://localhost:5000/')
})