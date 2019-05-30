import ConnectionUtils from '../../ConnectionUtils';

function call(event, username, password, wallet_words) {
    const headers = [
        { name: 'username', value: username },
        { name: 'password', value: password }
    ];

    var jsonObj = new Object();
    jsonObj.wallet_seed = wallet_words;

    ConnectionUtils.ownerRequest('POST', 'restore_wallet', headers, JSON.stringify(jsonObj), function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            global.session_token = JSON.parse(response.body).session_token;
        }

        event.returnValue = result;
    });
}

export default {call}