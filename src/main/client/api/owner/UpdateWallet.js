import ConnectionUtils from '../../ConnectionUtils';

function call(event, fromGenesis) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    const queryString = (fromGenesis == true ? "?fromGenesis" : "");
    ConnectionUtils.ownerRequest('POST', 'update_wallet' + queryString, headers, '', function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;
        event.returnValue = result;
    });
}

export default {call}