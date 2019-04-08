import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (slate, callback) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'finalize_tx?post', headers, slate, function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            result["tx"] = JSON.parse(response.body);
        }

        callback(result);
    });
}