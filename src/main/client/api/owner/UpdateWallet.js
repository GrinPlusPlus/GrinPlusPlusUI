import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, fromGenesis) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    const queryString = (fromGenesis == true ? "?fromGenesis" : "");

    log.info("Calling update_wallet");
    ConnectionUtils.ownerRequest('POST', 'update_wallet' + queryString, headers, '', function (response) {
        if (response.status_code != 200) {
            log.error("Error updating wallet. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('UpdateWallet::Response', response.status_code);
        }
    });
}

export default {call}