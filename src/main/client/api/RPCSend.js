import ConnectionUtils from '../ConnectionUtils';
var jayson = require('jayson');
import log from 'electron-log';

function send(amount, strategy, inputs, address, message, callback) {
    var client = jayson.client.http('http://127.0.0.1:3421/v2');

    var reqJSON = new Object();
    reqJSON['amount'] = amount;
    reqJSON['fee_base'] = 1000000;
    reqJSON['selection_strategy'] = {
        strategy: strategy,
        inputs: inputs
    };
    reqJSON['session_token'] = global.session_token;

    if (address != null && address.length > 0) {
        reqJSON['address'] = address;
    }

    if (message != null && message.length > 0) {
        reqJSON['message'] = message;
    }

    client.request('send', reqJSON, function (err, response) {
        if (err != null) {
            log.error('Send error: ');
            log.error(err);
            callback({
                success: false,
                error: err
            });
        } else {
            log.info('Send response: ');
            log.info(response)
            if (response.result != null) {
                callback({
                    success: true,
                    slate: response.result.Ok
                });
            } else {
                callback({
                    success: false,
                    error: response.error
                });
            }
        }
    });
}

export default { send }