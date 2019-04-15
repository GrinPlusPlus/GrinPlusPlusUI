import ConnectionUtils from '../../ConnectionUtils';

exports.call = function (event, username, password, grinboxSubscriber) {
    const headers = [
        { name: 'username', value: username },
        { name: 'password', value: password }
    ];

    ConnectionUtils.ownerRequest('POST', 'login', headers, '', function (response) {
        if (response.status_code == 200) {
            const parsed = JSON.parse(response.body);
            global.session_token = parsed.session_token;
            grinboxSubscriber(parsed.grinbox_key, parsed.grinbox_address);

            event.returnValue = response.status_code;
        } else {
            event.returnValue = response.status_code;
        }
    });
}
