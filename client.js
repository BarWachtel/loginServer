var serverUrl = 'http://localhost',
portNumber = 9000;


function startClient() {
  $('#loginForm').submit(function(e) {
    // e.preventDefault();
    console.log('Login button pressed');
    $.ajax({
      crossDomain: true,
      url: serverUrl + ':' + portNumber + '/login',
      type: 'POST',
      dataType: 'json',
      data: $.param({
        username: $('#username').val(),
        password: $('#password').val()
      }),
      success: function(data, textStatus, jqXHR) {
        console.log('ajax returned success');
        console.log(data);
        console.log(textStatus);
      },
      error: function(jqXHR, textStatus) {
        console.log('ajax returned error');
        console.log(textStatus);
      }
    });
    return false;
  });

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
      url: serverUrl + ':' + portNumber + '/register',
      type: 'POST',
      data: $.param({
        username: $('#username').val(),
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
}

$(startClient);
