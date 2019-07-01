import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, txId) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    log.info("Canceling transaction " + txId);
    ConnectionUtils.ownerRequest('POST', 'cancel_tx?id=' + txId, headers, '', function (response) {
        if (response.status_code != 200) {
            log.error("Error canceling transaction. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('Cancel::Response', response.status_code);
        }
    });
}

export default {call}