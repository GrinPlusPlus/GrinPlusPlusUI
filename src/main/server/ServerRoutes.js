'use strict';
module.exports = function (app) {
    var foreign = require('./controllers/ForeignController');

    // Foreign Routes
    app.route('/v1/wallet/foreign/receive_tx')
        .post(foreign.receive_tx);
};
