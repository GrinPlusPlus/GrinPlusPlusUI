import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (event, txId) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'repost_tx?id=' + txId, headers, '', function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;
        event.returnValue = result;
    });
}