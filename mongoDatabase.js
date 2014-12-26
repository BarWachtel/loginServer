var mongoose = require('mongoose');
var dbName = 'users';

var userSchema = mongoose.Schema({
  name: String,
  password: String
});

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

mongoose.connect('mongodb://localhost/' + dbName);

var mongodb = mongoose.connection;
var User = mongodb.model('User', userSchema);


mongodb.on('error', console.error.bind('Error connecting to db:' + dbName));
mongodb.once('open', function(callback) {
  console.log('Connection to db:' + dbName + ' established');
  // showAllUsersInDb();
  findUser('bazza');
});

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

function findUser(name) {
  User.findOne({'name': name}, function (err, user) {
    console.log(user.name);
  });
}
