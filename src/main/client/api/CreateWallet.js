import { net } from 'electron';

exports.call = function(event, portNumber, username, password) {
    const req = net.request({
      method: 'POST',
      protocol: 'http:',
      hostname: '127.0.0.1',
      port: portNumber,
      path: '/v1/wallet/owner/create_wallet'
    });
    req.setHeader('username', username);
    req.setHeader('password', password);
    req.on('response', (response) => {
      var result = new Object();

      result["status_code"] = response.statusCode;
      if (response.statusCode == 200) {
        response.on('data', (chunk) => {
          var parsed = JSON.parse(chunk);
          result["wallet_seed"] = parsed.wallet_seed;
          global.session_token = parsed.session_token;
          result["session_token"] = session_token;
          event.returnValue = result;
        })
      } else {
        event.returnValue = result;
      }

    });
    req.end();
}
