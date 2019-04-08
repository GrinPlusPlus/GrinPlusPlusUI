import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (event, username, password) {
    const headers = [
        { name: 'username', value: username },
        { name: 'password', value: password }
    ];

    ConnectionUtils.ownerRequest('POST', 'login', headers, '', function (response) {
        if (response.status_code == 200) {
            global.session_token = JSON.parse(response.body).session_token;
            event.returnValue = response.status_code;
        } else {
            event.returnValue = response.status_code;
        }
    });
}
