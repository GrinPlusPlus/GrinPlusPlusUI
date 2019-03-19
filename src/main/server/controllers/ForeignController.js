import {net} from 'electron';

exports.receive_tx = function(req, res) {
  req.on('data', (chunk) => {
      const ownerReq = net.request({
        method: 'POST',
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: 13420,
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
      ownerReq.write(chunk);
      ownerReq.end();
  });


  // Task.find({}, function(err, task) {
  //   if (err)
  //     res.send(err);
  //   res.json(task);
  // });
};
