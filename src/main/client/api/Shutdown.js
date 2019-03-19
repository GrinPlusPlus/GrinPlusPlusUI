import { net } from 'electron';

exports.call = function() {
  const req = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: 13413,
    path: '/v1/shutdown'
  });
  req.end();
}
