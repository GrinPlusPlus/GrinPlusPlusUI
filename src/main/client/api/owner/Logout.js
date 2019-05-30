import ConnectionUtils from '../../ConnectionUtils';

function call(event) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('POST', 'logout', headers, '', function (response) {
        global.session_token = null;
    });
}

export default {call}