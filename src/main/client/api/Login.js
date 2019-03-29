import { net } from 'electron';

exports.call = function(event, portNumber, username, password) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: portNumber,
    path: '/v1/wallet/owner/login'
  });
  req.setHeader('username', username);
  req.setHeader('password', password);
  req.on('response', (response) => {
    if (response.statusCode == 200) {
      response.on('data', (chunk) => {
        global.session_token = JSON.parse(chunk).session_token;
        event.returnValue = response.statusCode;
      })
    } else {
      event.returnValue = response.statusCode;
    }
  });
  req.end();
}
