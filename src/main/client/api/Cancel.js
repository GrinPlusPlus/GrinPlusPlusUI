import { net } from 'electron';

exports.call = function(event, txId) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 13420,
    path: '/v1/wallet/owner/cancel_tx?id=' + txId
  });
  req.setHeader('session_token', global.session_token);
  req.on('response', (response) => {
    var result = new Object();
    result["status_code"] = response.statusCode;
    event.returnValue = result;
  });
  req.end();
}
