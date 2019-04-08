import ConnectionUtils from '../ConnectionUtils';

const RECEIVE_TX_PATH = '/v1/wallet/foreign/receive_tx';

exports.RECEIVE_TX_PATH = RECEIVE_TX_PATH;

exports.call = function (httpAddress, slate, callback) {
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
