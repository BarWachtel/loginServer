var serverUrl = 'http://localhost',
    portNumber = 9000;


function startClient() {
  $('#loginForm').submit(function(e) {
    // e.preventDefault();

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
}

$(startClient);
