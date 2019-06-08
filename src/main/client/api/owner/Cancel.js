import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, txId) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    log.info("Canceling transaction " + txId);
    ConnectionUtils.ownerRequest('POST', 'cancel_tx?id=' + txId, headers, '', function (response) {
        log.info("Cancel result: " + JSON.stringify(response));

        var result = new Object();
        result["status_code"] = response.status_code;
        event.returnValue = result;
    });
}

export default {call}