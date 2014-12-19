//Creates a JWT token and returns it to user
var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();


var jwt = require('jsonwebtoken');
var jwtSecret = 'AFBE234ssSAsas8hjfSECREtsz';
var portNumber = 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/login', function(req, res) {

	//Perform user authentication here
	//Extract username/password from req.query
	console.log('url: ' + req.url);
	console.log('query: ' + req.query);
	console.log('body: ' + req.body);
	console.log('params: ' + req.params);

	// var params = url.parse(req.url + '?' + req.body, true).query;
	console.log('username: ' + req.body.username);
	console.log('password: ' + req.body.password);

	var someInfo = {
		// Looks like an raw format for
		// user info on initial login
		username: 'bazza',
		level: 10,
		friendsOnline: [
		'james', 'yourUncle'
		]
	};

	var token = jwt.sign(someInfo, jwtSecret, { expiresInMinutes: 60*5});

	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.contentType('json');
	res.json({token: token});
	res.end();
});

http.createServer(app).listen(portNumber);
