var httpType = 'http://',
serverUrl = 'localhost',
portNumber = 9000,
serverAddress = httpType + serverUrl + ':' + portNumber,
socket = null;

console.log(serverAddress);

function startClient() {
  $('#displayRegisterFormButton').click( function(e) {
    console.log('Display register form button pressed');
    $('#confirmPassword').attr('hidden', false);
    $('#confirmPassword').attr('disabled', false);
    $('#registerButton').attr('disabled', false);
  });

  $('#registerButton').click( function(e) {
    console.log('Register button clicked');
    $.ajax({
      crossDomain: true,
      url: serverAddress + '/register',
      type: 'POST',
      data: $.param({
        name: $('#username').val(),
        password: $('#password').val(),
        confirmPassword: $('#confirmPassword').val()
      }),
      success: function(data, textStatus, jqXHR) {
        console.log('Server replied: ' + data);
      },
      error: function(jqXHR, textStatus) {
        console.log();
      }
    });
  });


  $('#loginForm').submit(function(e) {
    // e.preventDefault();
    console.log('Login button pressed');

    // For some reason this AJAX request is stuck in pending
    // Sometimes gets callbacked more then once,
    // make sure not to recreate websocket etc.
    $.ajax({
      crossDomain: true,
      url: serverAddress + '/login',
      type: 'POST',
      dataType: 'json',
      data: $.param({
        name: $('#username').val(),
        password: $('#password').val()
      }),
      success: function(data, textStatus, jqXHR) {
        console.log('login ajax returned success');
        console.log('data.token: ' + data.token);
        console.log(textStatus);
        console.log(jqXHR);
        if (data.token) {
          console.log('Login success, calling openWebSocket');
          console.log('data.token: ' + data.token);
          openWebSocket(data.token);
        } else {
          console.log(data.reply);
        }
      },
      error: function(jqXHR, textStatus) {
        console.log('login ajax returned error');
        // console.log(textStatus);
      }
    });
    return false;
  });
}

function openWebSocket(token) {
  if (socket === null) {
        console.log('Creating initial websocket!');
        try {
            socket = io.connect('ws://' + serverUrl + ':' + portNumber, {
                query: 'token=' + token + '&' + 'username=' + $('#username').val()
            });
        } catch (err) {
            console.error('Error occured opening socket: ' + err);
        }
  }

  socket.on('connect', function(data){
    console.log('Socket connection opened!');
    });
    
    socket.on('error', function (err) {
        console.error('Error occured, disconnecting socket');
        socket.disconnect();
    });

  window.onbeforeunload = function(e) {
    alert('Navigating away from page');
    socket.disconnect();
  };
}

$(startClient);


