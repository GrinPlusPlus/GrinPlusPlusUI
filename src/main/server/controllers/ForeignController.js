import { net } from 'electron';

function receive_tx(req, res) {
    console.log("hello");

    var received = "";

    req.on('data', (foreignChunk) => {
        received += foreignChunk;
    });

    req.on('end', () => {
        const ownerReq = net.request({
            method: 'POST',
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: 3420,
            path: '/v1/wallet/owner/receive_tx'
        });
        ownerReq.setHeader('session_token', global.session_token);

        ownerReq.on('response', (response) => {
            res.statusCode = response.statusCode;
            if (response.statusCode == 200) {

                var responseStr = "";
                response.on('data', function (chunk) {
                    responseStr += chunk;
                });

                response.on('end', function () {
                    console.log(responseStr);
                    res.json(JSON.parse(responseStr));
                });

            } else {
                res.send("ERROR"); // TODO: Better error handling
            }
        });
        ownerReq.write(received);
        ownerReq.end();
    });
};

export default {receive_tx}