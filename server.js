//Creates a JWT token and returns it to user
var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();


var jwt = require('jsonwebtoken');
var jwtSecret = 'AFBE234ssSAsas8hjfSECREtsz';
var portNumber = 9000;
var db = require('./database.js');

// Parse body - creates request.body (access parameters)
app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.post('/login', function(req, res) {
	var userDetails = req.body;

	// Crappy search method for large database
	var userFound = false;
	for (var i = 0; i < db.users.length ; i++) {
		if (db.users[i].getName() === userDetails.username) {
			console.log('Username found in database');
			// Username matches, try to authenticate password
			userFound = true;
			var user = db.users[i];

			// I am hashing password outside comparison since theres a
			// good chance client will submit a hashed password
			if (user.comparePassword(db.hash(userDetails.password))) {
				console.log('Password is correct');
				user.getFriendsList().forEach(console.log);
			} else {
				console.log('Password does not match user');
			}
			break;
		}
	}
	if (!userFound) {
		console.log('Username not found in database');
	}

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
	res.contentType('json');
	res.json({token: token});
	res.end();
});

app.post('/register', function(req, res) {
	// res.send('Hey, please add username and password');
	var userDetails = req.body;
	console.log('Requested username ' + userDetails.username);
	console.log('Requested password ' + userDetails.password);
	if (userDetails.password === userDetails.confirmPassword) {
		console.log('User\'s passwords match, add him to DB!');
	} else {
		console.log('User\'s passwords dont match');
	}
});

http.createServer(app).listen(portNumber);
