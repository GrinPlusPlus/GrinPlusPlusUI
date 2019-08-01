import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(slate, address, message, callback) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    var reqJSON = new Object();
    reqJSON["slate"] = JSON.parse(slate);

    if (address != null && address.length > 0) {
        reqJSON['address'] = address;
    }

    if (message != null && message.length > 0) {
        reqJSON['message'] = message;
    }

    log.info("Receiving slate: " + slate);
    ConnectionUtils.ownerRequest('POST', 'receive_tx', headers, JSON.stringify(reqJSON), function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            result["slate"] = JSON.parse(response.body);
        }

        log.info("Result: " + JSON.stringify(result));
        callback(result);
    });
}

export default {call}