import { net } from 'electron';

exports.call = function(event, portNumber) {
    const req = net.request({
      method: 'POST',
      protocol: 'http:',
      hostname: '127.0.0.1',
      port: portNumber,
      path: '/v1/wallet/owner/update_wallet'
    });
    req.setHeader('session_token', global.session_token);
    req.on('response', (response) => {
      event.returnValue = response.statusCode;
    });
    req.end();
}
