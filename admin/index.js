fs = require('fs');
var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    bodyParser      = require('body-parser'),
    session         = require('express-session');
 

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
// hardcoded users, ideally the users should be stored in a database
var users = [{"id":111, "username":"amy", "password":"itsmovietime"}];
 
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});
 
// passport local strategy for local-login, local refers to this app
passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        if (password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);
 
// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
	else 
		res.redirect('login')
 
    // res.sendStatus(401);
}
 
app.get("/", function (req, res) {
	res.redirect("/schedule");
});
 
// api endpoints for login, content and logout
app.get("/login", function (req, res) {
    res.send("<p>what time is it ??</p><form method='post' action='/login'><input hidden type='text' name='username' value='amy'/><input type='text' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});
app.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/login"}),
    function (req, res) {
        res.redirect("/schedule");
});

app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success!");
});

app.get('/scripts.js', function(req, res, next) {
    res.sendFile(__dirname + '/scripts.js');
});

app.get('/styles.css', function(req, res, next) {
    res.sendFile(__dirname + '/styles.css');
});

app.get('/library.json', function(req, res, next) {
    res.sendFile(__dirname + '/library.json');
});

app.get('/schedule', isLoggedIn, function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/save-schedule', isLoggedIn, function(req, res, next) {
	let current_date = new Date();

	let tomorrow = current_date.getHours() >= 12 ? 1 : 0;
	let date_time = current_date.addDays(tomorrow);
	let date = ("0" + date_time.getDate()).slice(-2);
	let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
	let year = date_time.getFullYear();

	const template = {
		"channel": "Channel 1",
		"date": "2022-01-08",
		"length": "24:00:00",
		"program": req.body
	}

	fs.writeFile('/home/flock/saladbowl/admin/schedules/' + year + "-" + month + "-" + date + '.json', JSON.stringify(template), (err) => {
		if (err) return console.log(err);
	});
	res.json({success: true})
})
 
// launch the app
app.listen(3030);
console.log("App running at localhost:3030");


