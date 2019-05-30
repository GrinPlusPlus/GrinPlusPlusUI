import ConnectionUtils from '../../ConnectionUtils';

function call() {
    ConnectionUtils.nodeRequest('POST', '/v1/shutdown', '', function (_response) {});
}

export default {call}