import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, username, password) {
    const headers = [
        { name: 'username', value: username },
        { name: 'password', value: password }
    ];

    log.info("Creating wallet with username: " + username);
    ConnectionUtils.ownerRequest('POST', 'create_wallet', headers, '', function (response) {
        log.info("Wallet creation status: " + response.status_code);

        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            const parsed = JSON.parse(response.body);
            result["wallet_seed"] = parsed.wallet_seed;
            global.session_token = parsed.session_token;
            result["session_token"] = session_token;
        }

        event.returnValue = result;
    });
}

export default {call}