import { net } from 'electron';

exports.call = function(portNumber) {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: portNumber,
    path: '/v1/shutdown'
  });
  req.end();
}
