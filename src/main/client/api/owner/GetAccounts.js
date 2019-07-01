import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event) {
    const headers = [];
    ConnectionUtils.ownerRequest('GET', 'accounts', headers, '', function (response) {
        var accounts = [];

        if (response.status_code == 200) {
            accounts = JSON.parse(response.body);
        } else {
            log.error("Error retrieving accounts. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('GetAccounts::Response', response.status_code, accounts);
        }
    });
}

export default {call}