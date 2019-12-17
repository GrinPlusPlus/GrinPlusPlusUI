const net = require('net');

const CONTROL_PORT = 9051;

let controlConnection = null;
let controlConnectionConnected = false;
let controlAuth = false;
let controlHiddenService = false;
let controlHiddenServiceDestroy = false;

exports.start = (controlPassword, keyPair) => {
    return new Promise((resolve, reject) => {
        //let constrolPortStr;
        //try {
        //    constrolPortStr = fs.readFileSync(controlPortFile, { encoding: 'utf8' });
        //} catch (error) {
        //    reject(new Error(langs.get('ErrorNoControlFile')));
        //    return;
        //}

        //let controlPort;
        //if (constrolPortStr && constrolPortStr.split) {
        //    controlPort = ((constrolPortStr.split('\n'))[0]).replace('\r', '').substr(constrolPortStr.indexOf(':') + 1) * 1;
        //}

        //if (!controlPort) {
        //    reject(new Error(langs.get('ErrorControlPort')));
        //    return;
        //}

        controlConnection = net.connect({ host: "127.0.0.1", port: CONTROL_PORT });

        controlConnection.once('connect', () => {
            controlConnectionConnected = true;
            controlConnection.write('AUTHENTICATE "' + controlPassword.string + '"\r\n');
        })

        controlConnection.once('error', (err) => {
            controlConnectionConnected = false;
            if (err) {
                reject(err);
            }
        });

        controlConnection.once('end', () => {
            controlConnection = null;
            controlConnectionConnected = false;
            controlAuth = false;
            controlHiddenService = null;
        })

        controlConnection.on('data', (data) => {
            data = data.toString();

            const lines = data.split('\r\n');
            lines.forEach(line => {
                if (line.length === 0) { return; }

                if (!controlAuth || controlHiddenServiceDestroy) {
                    if (line.substr(0, 6) === '250 OK') {
                        controlAuth = true;
                        const secretKeySerial = keyPair.secretKey.toString('base64')

                        controlConnection.write(
                            `ADD_ONION ED25519-V3:${secretKeySerial} ` +
                            `Flags=DiscardPK ` +
                            `Port=${constant.ServiceInsidePort},127.0.0.1:${config.getServicePort()} \r\n`
                        );

                        controlHiddenServiceDestroy = false;
                    }
                }
                else if (!controlHiddenService) {
                    if (line.substr(0, 3) === '250') {
                        if (line.indexOf('250-ServiceID=') > -1) {
                            const strID = parser.findStringAfter(line, '250-ServiceID=');
                            if (strID) {
                                controlHiddenService = strID;
                                controlConnection.write('GETINFO net/listeners/socks \r\n');
                            }
                        }
                    }
                    else {
                        reject(new Error(langs.get('ErrorHiddenService')));
                    }
                }
                else {
                    if (-1 < line.indexOf("status/bootstrap-phase")) {
                        const percentStr = parser.findStringBetween(line, "PROGRESS=", " ");
                        if (percentStr) {
                            const percent = percentStr * 1;
                            eventEmitter.emit('process', percent);
                        }

                    }
                    if (-1 < line.indexOf("net/listeners/socks")) {
                        const socksPortStr = parser.findStringBetween(line, ":", '"');
                        if (socksPortStr) {
                            const socksPort = socksPortStr * 1;
                            eventEmitter.emit('socksport', socksPort);
                        }
                    }
                }
            });
        });
    })
}

exports.destroy = () => {
    if (controlConnection && !controlConnection.destroyed && controlConnectionConnected) {
        controlConnection.write(`DEL_ONION ${controlHiddenService}\r\n`);
        controlConnection.write(`SIGNAL SHUTDOWN \r\n`);
        controlConnection.write('QUIT\r\n');
    }
}

exports.AddOnionByKey = (key) => {

}