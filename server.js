// HTTP and WebSocket server initialization
var express = require('express');
var app = express();
var server = require('http').Server(app);
var sio = require('socket.io')(server);
var portNumber = 9000;

// Used to parse POST body
var bodyParser = require('body-parser');
// var url = require('url');

//Creates a JWT token and returns it to user
var jwt = require('jsonwebtoken');
var jwtSecret = 'AFBE234ssSAsas8hjfSECREtsz';

// THIS WORKS -
//app.set('jwtSecret', jwtSecret);
//app.get('jwtSecret');

var db = require('./database.js');

// Express app
// Parse body - creates request.body (access query parameters)
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
	//Anything following next() is executed
});


// Handle client HTTP POST requests
app.post('/login', function (req, res) {
    var userDetails = req.body;
    
    db.getUser(userDetails.name, function (err, user) {
        if (err) {
            console.log('login error: ' + err);
            next(err);
        } else {
            if (user) {
                if (user.comparePassword(userDetails.password)) {
                    console.log('Password is correct');
                    
                    var token = createToken({ name: user.getName() });
                    
                    //Store onlineUser in database
                    db.addOnlineUser({ name: user.getName(), token: token }, function (err, _user) {
                        if (err) {
                            console.log('Error occured in user login');
                            res.json({
                                reply: 'Error occured in user login',
                                token: null
                            });
                        } else {
                            if (_user) {
                                res.contentType('json');
                                res.json({ token: token });
                                //res.end();
                            } else {
                                console.log('Add Online User returned null user');
                            }               
                        }
                    });

                } else {
                    res.json({
                        reply: 'Incorrect password',
                        token: null
                    });
                }
            } else {
                // user is null
                res.json({
                    reply: 'User does not exist',
                    token: null
                });
            }
        }
    });
});

app.post('/register', function (req, res) {
    // Example of how to send a simple response to client
    // res.send('Hey, please add username and password');
    var userDetails = req.body;
    if (userDetails.password === userDetails.confirmPassword) {
        db.addUser(userDetails, function (err, user) {
            if (err) {
                console.log('add user error: ' + err);
                res.send('Username was already taken!');
            } else {
                console.log('User added');
                
                res.send('Hi ' + user.name +
				', your user was created successfuly');
            }
        }); // db.addUser
    } else {
        res.send('Passwords do not match, try again');
    }
}); // post

app.post('*', function (req, res, next) {
    res.statusCode = 200;
    res.end();
})

// Start HTTP server
server.listen(portNumber);

//WebSocket server

// socket.io website recommends using the following method
// for socket authentication, the following is called prior to
// socket being created
sio.use(function (socket, next) {
    var token = socket.request._query.token;
    if (token) {
        try {
            jwt.verify(token, jwtSecret, function (err, decoded) {
                if (err) {
                    console.log('Error occured authenticating token ' + err);
                } else {
                    console.log('authenticated ' + decoded.name + '\'s token');
                    //Not moving onto on('connection') method !!
                    next(socket);
                }
            });
        } catch (err) {
            console.log('Exception occured authenticating token ' + err);
        }
    }
    
    // authenticate data, if error then -
    // 		next(new Error('Error description'));
    //next();
});

// Handle client websocket connection
sio.on('connection', function (socket) {
    var query = socket.request._query;
    var userToken = query.token,
        username = query.username;

    if (username && userToken) {
        db.getOnlineUser(username, function (err, onlineUser) {
            if (err) {
                socket.disconnect(); // Can pass an event to be emitted on client side
            }
            if (onlineUser) {
                if (onlineUser.compareToken(userToken)) {
                    // Success
                    onlineUser.setSocket(socket.id);
                    onlineUser.save(function (err) {
                        if (err) {
                            socket.disconnect();
                            console.log('Error saving: ' + err);
                        } else {
                            console.log('User ' + onlineUser.getName() + ' is online!');
                        }
                    });
                }
            } else {
                socket.disconnect();
            }
        });
        
        // After socket authentication is succesful
        //socket.set('username', username);
    }

    socket.on('disconnect', function (socket) {
        // Make sure this isnt called when socket is disconnected server side
        console.log('Socket disconnected');
        socket.get('username', function (err, username) {
            db.removeOnlineUser(username, function (err) {
                if (err) {
                    console.log('Some error occured while removing user ' + username);
                }
            });
        });      
    }); // socket.on('disconnect')

    socket.on('');

}); // sio.on('connection')




// Helper functions
function createToken(info) {
    // as of now jwtSecret is a global variable - not good design
    return jwt.sign(info, jwtSecret, { expiresInMinutes: 60 * 5 });
}

