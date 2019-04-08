import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (event) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'logout', headers, '', function (response) {
        global.session_token = null;
    });
}
