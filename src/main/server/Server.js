import express from 'express';
import foreign from './controllers/ForeignController';
import log from 'electron-log';

function start() {

    var app = express();
    var port = process.env.PORT || 3415;
    
    // Foreign Routes
    app.route('/v1/wallet/foreign/receive_tx')
        .post(foreign.receive_tx);

    //const options = getServerOptions();
    /*https.createServer({ key: options.privateKey, cert: options.certificate }, app)*/

    app.listen(port);

    log.info('Foreign API server started on: ' + port);
}

export default {start}