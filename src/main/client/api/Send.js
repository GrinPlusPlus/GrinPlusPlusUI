import { net } from 'electron';

exports.call = function(event, amount) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 13420,
    path: '/v1/wallet/owner/issue_send_tx'
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

  var reqJSON = new Object();
  reqJSON['amount'] = amount;
  reqJSON['fee_base'] = 1000000;
  reqJSON['selection_strategy'] = "ALL";
  req.write(JSON.stringify(reqJSON));
  req.end();
}
