
fs = require('fs');
const express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.json());

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/favicon.ico');
});

app.get('/scripts.js', function(req, res, next) {
    res.sendfile(__dirname + '/scripts.js');
});

app.get('/styles.css', function(req, res, next) {
    res.sendfile(__dirname + '/styles.css');
});

app.get('/library.json', function(req, res, next) {
    res.sendfile(__dirname + '/library.json');
});

app.post('/save-schedule', function(req, res, next) {
	let current_date = new Date();
	let date_time = current_date.addDays(10);
	let date = ("0" + date_time.getDate()).slice(-2);
	let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
	let year = date_time.getFullYear();
	fs.writeFile(year + "-" + month + "-" + date + '.json', JSON.stringify(req.body), (err) => {
		if (err) return console.log(err);
	});
	res.send('success')
})


http.listen(3004, function(){
  console.log('listening on *:3000');
});
