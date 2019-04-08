import ConnectionUtils from '../../ConnectionUtils';

exports.call = function () {
    ConnectionUtils.nodeRequest('POST', '/v1/shutdown', '', function (_response) {});
}