import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, fromGenesis) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    const queryString = (fromGenesis == true ? "?fromGenesis" : "");

    log.info("Calling update_wallet");
    ConnectionUtils.ownerRequest('POST', 'update_wallet' + queryString, headers, '', function (response) {
        log.info("Response: " + JSON.stringify(response));

        var result = new Object();
        result["status_code"] = response.status_code;
        event.returnValue = result;
    });
}

export default {call}