import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (event, slate) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'issue_send_tx', headers, slate, function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            result["slate"] = JSON.parse(response.body);
        }

        even.returnValue = result;
    });
}