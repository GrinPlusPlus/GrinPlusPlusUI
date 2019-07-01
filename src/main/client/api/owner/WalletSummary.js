import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('GET', 'retrieve_summary_info', headers, '', function (response) {
        var result = new Object();

        if (response.status_code == 200) {
            var json = JSON.parse(response.body);

            result["last_confirmed_height"] = json.last_confirmed_height;
            result["minimum_confirmations"] = json.minimum_confirmations;
            result["total"] = json.total;
            result["amount_awaiting_confirmation"] = json.amount_awaiting_confirmation;
            result["amount_immature"] = json.amount_immature;
            result["amount_locked"] = json.amount_locked;
            result["amount_currently_spendable"] = json.amount_currently_spendable;
            result["transactions"] = JSON.stringify(json.transactions);
        } else {
            log.error("Error receiving wallet summary. Response: " + JSON.stringify(response));
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('WalletSummary::Response', response.status_code, result);
        }
    });
}

export default {call}