import express from 'express';
import foreign from './controllers/ForeignController';
import log from 'electron-log';
import { net } from 'electron';
const bodyParser = require('body-parser')
const jayson = require('jayson')

const FOREIGN_PORT = 3415;

async function ownerReceive(slate) {
    const ownerReq = net.request({
        method: 'POST',
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: 3420,
        path: '/v1/wallet/owner/receive_tx'
    });
    ownerReq.setHeader('session_token', global.session_token);
    log.info("ownerReceive: ");
    log.info(slate);

    const promise = new Promise((resolve, reject) => {
        ownerReq.on('response', (response) => {
            log.debug("Owner response status: " + response.statusCode);

            if (response.statusCode == 200) {
                var responseStr = "";
                response.on('data', function (chunk) {
                    responseStr += chunk;
                });

                response.on('end', function () {
                    log.debug("Owner response: " + responseStr);
                    resolve(JSON.parse(responseStr));
                });

            } else {
                // TODO: Handle this
                reject("ERROR");
            }
        });
        ownerReq.write(JSON.stringify(slate));
        ownerReq.end();
    });

    return await promise;
}

const rpc_api = {
    receive_tx: function (args, callback) {
        log.info('Receiving tx through foreign API: ');
        log.info(args);

        if (args.length == 3 && global.session_token != null) {
            ownerReceive(args[0])
                .then(ownerResult => {
                    log.info("OWNER RESULT:");
                    log.info(ownerResult);

                    callback(null, {
                        "Ok": ownerResult
                    });
                });
        } else {
            callback("ERROR", null);
        }
    },
    check_version: function (args, callback) {
        log.info("check_version");
        callback(null, {
            "Ok": {
                "foreign_api_version": 2,
                "supported_slate_versions": [
                    "V2"
                ]
            }
        });
    }
}

function start() {

    var app = express();

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.route('/v2/foreign/').post(jayson.server(rpc_api).middleware());
    
    // Foreign Routes
    app.route('/v1/wallet/foreign/receive_tx')
        .post(foreign.receive_tx);

    var port = process.env.PORT || 3415;
    app.listen(port);

    log.info('Foreign API server started on: ' + FOREIGN_PORT);
}

export default { start }