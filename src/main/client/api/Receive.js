import { net } from 'electron';

exports.call = function(event, slate) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 13420,
    path: '/v1/wallet/owner/receive_tx'
  });
  req.setHeader('session_token', global.session_token);
  req.on('response', (response) => {
    var result = new Object();
    result["status_code"] = response.statusCode;

    var body = "";
    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      if (response.statusCode == 200) {
        result["slate"] = JSON.parse(body);
      }

      event.returnValue = result;
    });
  });
  req.write(slate);
  req.end();
}
