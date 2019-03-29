import { net } from 'electron';

exports.call = function(event, portNumber) {
  const req = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: portNumber,
    path: '/v1/wallet/owner/retrieve_txs'
  });
  req.setHeader('session_token', global.session_token);
  req.on('response', (response) => {
    var result = new Object();
    result["status_code"] = response.statusCode;
    if (response.statusCode == 200) {
      response.on('data', (chunk) => {
        var json = JSON.parse(chunk);

        var transactions = [];
        for (var i = 0; i < json.transactions.length; i++) {
          var transactionJson = json.transactions[i];
          var transaction = new Object();

          transaction["id"] = transactionJson.id;
          transaction["status"] = transactionJson.type;
          transaction["amount"] = (transactionJson.amount_credited - transactionJson.amount_debited);

          var creation_date_time = new Date(0); // The 0 there is the key, which sets the date to the epoch
          creation_date_time.setUTCSeconds((transactionJson.creation_date_time));
          transaction["date_time"] = creation_date_time;
          transaction["confirmed"] = (transactionJson.confirmation_date_time != null);
          transactions.push(transaction);
        }

        result["transactions"] = transactions;
        event.returnValue = result;
      })
    } else {
      event.returnValue = result;
    }
  });
  req.end();
}
