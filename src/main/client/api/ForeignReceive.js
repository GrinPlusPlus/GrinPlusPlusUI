import ConnectionUtils from '../ConnectionUtils';
var jayson = require('jayson');
import log from 'electron-log';

const RECEIVE_TX_PATH = '/v1/wallet/foreign/receive_tx';

exports.RECEIVE_TX_PATH = RECEIVE_TX_PATH;

function call(httpAddress, slate, callback) {
    var result = new Object();
    result['status_code'] = 404;

    const req = ConnectionUtils.buildForeignRequest(httpAddress, RECEIVE_TX_PATH);
    if (req == null) {
        result["error_text"] = "Failed to connect to remote address";
        callback(result);
        return;
    }

    try {
        req.on('response', (response) => {
            result["status_code"] = response.statusCode;

            var body = "";
            response.on('data', (chunk) => {
                body += chunk;
            });

            response.on('end', () => {
                console.log(body);
                if (response.statusCode == 200) {
                    result["slate"] = JSON.parse(body);
                }

                callback(result);
            });
        });
        req.on('error', (error) => {
            console.log(error);
            result['raw_error'] = error.message;
            callback(result);
        });
        req.write(slate);
        req.end();
    } catch (err) {
        console.log(err);
        result["raw_error"] = err.message;
        callback(result);
    }
};

function callRPC(httpAddress, slate, callback) {
    var client = null;
    if (httpAddress.toLowerCase().startsWith('https')) {
        client = jayson.client.https(httpAddress + '/v2/foreign');
    } else {
        client = jayson.client.http(httpAddress + '/v2/foreign');
    }

    client.request('receive_tx', [slate, null, ""], function (err, response) {
        if (err != null) {
            log.error('Receive_tx error: ');
            log.error(err);
            callback({
                success: false,
                error: err
            });
        } else {
            log.info('Receive_tx response: ');
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

export default { call, callRPC }