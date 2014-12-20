// Just a dummy database, move to mongodb later

//Create the user class
function User(name, password) {
  var _name = name;
  var _password = _hash(password);
  var _friendsList = ['harry', 'sally', 'robert'];
  // Added to hash function with user password
  var _salt = null;

  this.getName = function() { return _name; };
  this.comparePassword = function(password) { return _password === password; };
  this.getFriendsList = function() { return _friendsList; };
}

//Weak hash function, outputs a 32bit integer
function _hash (password) {
  var hash = 0, i, chr, len;
  password = password ? password : '';
  if (password.length == 0) return hash;
  for (i = 0, len = password.length; i < len; i++) {
    chr   = password.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function _addUser(userDetails) {
  if (!_getUser(userDetails.username)) {
    // Username does not exist in database
  }
}

function _getUser(username) {
  var user = null;
  for (var i = 0 ; i < _users.length ; i++) {
    if (_users[i].getName() === username) {
      user = _users[i];
      break;
    }
  };
  return user;
}

var _users = [];

module.exports = {
  users: _users,
  hash: _hash,
  addUser: _addUser,
  getUser: _getUser
}
