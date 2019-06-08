import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(slate, callback) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    log.info("Receiving slate: " + slate);
    ConnectionUtils.ownerRequest('POST', 'receive_tx', headers, slate, function (response) {
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