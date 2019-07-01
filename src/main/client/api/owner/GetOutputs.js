import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, showSpent, showCanceled) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    var queryString = '';
    if (showSpent) {
        queryString += '?show_spent';
    }

    if (showCanceled) {
        queryString += (queryString.length == 0 ? '?show_canceled' : '&show_canceled');
    }

    ConnectionUtils.ownerRequest('GET', 'retrieve_outputs' + queryString, headers, '', function (response) {
        var outputs = null;

        if (response.status_code == 200) {
            var json = JSON.parse(response.body);
            outputs = json.outputs;
        } else {
            log.error("Error retrieving outputs. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('GetOutputs::Response', response.status_code, outputs);
        }
    });
}

export default {call}