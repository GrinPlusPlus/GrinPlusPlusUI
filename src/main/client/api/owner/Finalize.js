import ConnectionUtils from '../../ConnectionUtils';
import log from 'electron-log';

function call(slate, callback) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    
    log.info("Finalizing slate: " + slate);
    ConnectionUtils.ownerRequest('POST', 'finalize_tx?post', headers, slate, function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            result["tx"] = JSON.parse(response.body);
        }
        
        log.info("Result: " + JSON.stringify(result));
        callback(result);
    });
}

export default {call}