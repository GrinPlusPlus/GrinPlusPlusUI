import ConnectionUtils from '../../ConnectionUtils';

function call(callback) {
    ConnectionUtils.nodeRequest('GET', '/v1/status', '', function (response) {
        if (response.status_code == 200) {
            var status = JSON.parse(response.body);
            callback(status);
        } else {
            callback(null);
        }
    });
}

export default {call}