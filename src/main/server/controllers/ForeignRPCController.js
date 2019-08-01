import { net } from 'electron';
import log from 'electron-log';

function receive_tx(req, res) {
    log.info("ForeignController: Receiving a transaction through the foreign API.");

    var received = "";

    req.on('data', (foreignChunk) => {
        received += foreignChunk;
    });

    req.on('end', () => {
        log.debug("Received: " + received);

        const ownerReq = net.request({
            method: 'POST',
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: 3420,
            path: '/v1/wallet/owner/receive_tx'
        });
        ownerReq.setHeader('session_token', global.session_token);

        ownerReq.on('response', (response) => {
            log.debug("Owner response status: " + response.statusCode);

            res.statusCode = response.statusCode;
            if (response.statusCode == 200) {
                var responseStr = "";
                response.on('data', function (chunk) {
                    responseStr += chunk;
                });

                response.on('end', function () {
                    log.debug("Owner response: " + responseStr);
                    res.json(JSON.parse(responseStr));

                    if (global.mainWindow != null) {
                        global.mainWindow.webContents.send('Snackbar::Status', 'SUCCESS', 'Received transaction from ' + req.get('host'));
                    }
                });

            } else {
                res.send("ERROR"); // TODO: Better error handling
                if (global.mainWindow != null) {
                    global.mainWindow.webContents.send('Snackbar::Status', 'ERROR', 'Incoming transaction from ' + req.get('host') + ' failed.');
                }
            }
        });
        ownerReq.write(received);
        ownerReq.end();
    });
};

export default {receive_tx}