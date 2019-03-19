import { net } from 'electron';

exports.call = function(event) {
  const req = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 13420,
    path: '/v1/wallet/owner/retrieve_summary_info'
  });
  req.setHeader('session_token', global.session_token);
  req.on('response', (response) => {
    var result = new Object();
    result["status_code"] = response.statusCode;
    if (response.statusCode == 200) {
      response.on('data', (chunk) => {
        var json = JSON.parse(chunk);

        result["last_confirmed_height"] = json.last_confirmed_height;
        result["minimum_confirmations"] = json.minimum_confirmations;
        result["total"] = json.total;
        result["amount_awaiting_confirmation"] = json.amount_awaiting_confirmation;
        result["amount_immature"] = json.amount_immature;
        result["amount_locked"] = json.amount_locked;
        result["amount_currently_spendable"] = json.amount_currently_spendable;
        event.returnValue = result;
      })
    } else {
      event.returnValue = result;
    }
  });
  req.end();
}
