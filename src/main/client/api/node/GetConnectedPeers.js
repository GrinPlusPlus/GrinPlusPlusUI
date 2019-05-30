import ConnectionUtils from '../../ConnectionUtils';

function call(event) {
    ConnectionUtils.nodeRequest('GET', '/v1/peers/connected', '', function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            result["peers"] = JSON.parse(response.body);
        }

        event.returnValue = result;
    });
}

export default {call}