import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(event, username, password, grinboxSubscriber) {
    const headers = [
        { name: 'username', value: username },
        { name: 'password', value: password }
    ];

    log.info("Logging in with username: " + username);
    ConnectionUtils.ownerRequest('POST', 'login', headers, '', function (response) {
        log.info("Login status: " + response.status_code);

        if (response.status_code == 200) {
            const parsed = JSON.parse(response.body);
            global.session_token = parsed.session_token;

            if (parsed.tor_address != null) {
                global.tor_address = parsed.tor_address;
            }

            global.listener_port = parsed.listener_port;
            
            grinboxSubscriber(parsed.grinbox_key, parsed.grinbox_address);
        }

        if (global.mainWindow != null) {
            global.mainWindow.webContents.send('Login::Response', response.status_code);
        } else {
            log.error("global.mainWindow is null");
        }
    });
}

export default {call}