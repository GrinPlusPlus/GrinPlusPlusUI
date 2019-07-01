import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event) {
    const headers = [];

    log.info("Calling resync");
    ConnectionUtils.nodeRequest('POST', '/v1/resync', '', function (response) {
        log.info("Response: " + JSON.stringify(response));

        if (response.status_code != 200) {
            log.error("Error resyncing blockchain. Response: " + JSON.stringify(response));
        }

        /*if (global.mainWindow != null) {
            global.mainWindow.webContents.send('UpdateWallet::Response', response.status_code);
        }*/
    });
}

export default {call}