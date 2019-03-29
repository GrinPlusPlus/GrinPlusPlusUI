import { net } from 'electron';

exports.call = function(event, portNumber, username, password, wallet_words) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: portNumber,
    path: '/v1/wallet/owner/restore_wallet'
  });
  req.setHeader('username', username);
  req.setHeader('password', password);
  req.on('response', (response) => {
    var result = new Object();
    result["status_code"] = response.statusCode;

    if (response.statusCode == 200) {
      response.on('data', (chunk) => {
        global.session_token = JSON.parse(chunk).session_token;
        result["session_token"] = session_token;
        event.returnValue = result;
      })
    } else {
      event.returnValue = result;
    }
  });

  var jsonObj = new Object();
  jsonObj.wallet_seed = wallet_words;
  req.write(JSON.stringify(jsonObj));
  req.end();
}
