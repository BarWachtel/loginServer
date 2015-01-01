var mongoose = require('mongoose');
var dbName = 'users';
mongoose.connect('mongodb://localhost/' + dbName);

var userSchema = mongoose.Schema({
  name: String,
  password: String
});

userSchema.methods.comparePassword = function (password) {
  console.log('this.password: ' + this.password);
  console.log('password: ' + password);

  return this.password === password;
}

var onlineUserSchema = mongoose.Schema({
  name: String,
  socket: String
});

var userFriendshipSchema = mongoose.Schema({
  friendship: [String, String]
});


var mongodb = mongoose.connection;
var User = mongodb.model('User', userSchema);
var OnlineUser = mongodb.model('OnlineUser', onlineUserSchema);
var UserFriendship = mongodb.model('UserFriendship', userFriendshipSchema);


mongodb.on('error', console.error.bind('Error connecting to db:' + dbName));
mongodb.once('open', function(callback) {
  // console.log('Connection to db:' + dbName + ' established');
  // var userDetails = {
  //   name: 'mazza',
  //   password: 'kamaroi'
  // };
  // _addUser(userDetails, function() {
  //   _getUser(userDetails.name, function(err, user) {
  //     console.log('user.name: ' + user.name); // this works
  //   });
  // });
});


function _getUser(name, callback) {
  //callback(err, data)
  User.findOne({'name': name}, callback);
}

function _addUser(userDetails, callback) {
  User.create({name: userDetails.name, password: userDetails.password});
  var status = true;
  callback(status);
}

function findUser(name) {
  User.findOne({'name': name}, function (err, user) {
    console.log(user.name);
  });
}

function showAllUsersInDb() {
  User.find(function(err, users) {
    if (err) {
      console.error('Error occured in User.find');
    } else {
      users.forEach( function(user, index, _users) {
        console.log(user.toJSON());
      });
      // console.log('users:\n' + users);
    }
  });
}

module.exports = {
  getUser: _getUser,
  addUser: _addUser
}


/*
User collection:
Functions:
- addUser(userDetails)
- getUser(username)

onlineUsers collection:
var onlineUserSchema = mongoose.schema({
name: String,
socket: String *socket.id
});
Functions:
- storeOnlineUser(username)
- removeOnlineUser(username)
- areOnline()

userFriendship collection:
var userFriendshipSchema = mongoose.schema({
friendship: [String, String] *usernames
});
Functions:
- addFriendship([username, username])
- removeFriendship([username, username])
- [usernames..] getFriends(username)
*/
