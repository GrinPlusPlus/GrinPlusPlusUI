var jayson = require('jayson');
import log from 'electron-log';

function call(rpc_method, params, callback) {
    var req_str = JSON.stringify(params);
    log.info("Calling (" + rpc_method + ") with data:\n" + req_str);

    var client = jayson.client.http('http://127.0.0.1:3421/v2');
    client.request(rpc_method, params, function (err, response) {
        if (err != null) {
            log.error('Error: ' + JSON.stringify(err));
        } else {
            try {
                log.info('Result: ' + JSON.stringify(response));
            } catch (e) {

            }
        }

        callback(response, err);
    });
}

export default {call}