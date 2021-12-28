
fs = require('fs');
const express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.json());

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
	fs.writeFile('filename.json', JSON.stringify(req.body), (err) => {
		if (err) return console.log(err);
	});
	res.send('success')
})


http.listen(3004, function(){
  console.log('listening on *:3000');
});
