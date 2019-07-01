import ConnectionUtils from '../../ConnectionUtils';

function call(event, txId) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'repost_tx?id=' + txId, headers, '', function (response) {
        if (response.status_code != 200) {
            log.error("Error reposting transaction. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('Repost::Response', response.status_code);
        }
    });
}

export default {call}