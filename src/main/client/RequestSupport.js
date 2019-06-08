import ConnectionUtils from './ConnectionUtils';
import log from 'electron-log';

const GRINPP_URL = 'https://api.grinplusplus.com';
const SUPPORT_PATH = '/bugreports/submit.php';

async function call(event, name, email, description) {
    log.info("Submitting support request")
    const request = await ConnectionUtils.buildForeignRequest(GRINPP_URL, ForeignReceive.SUPPORT_PATH);
    if (request == null) {
        log.error("Failed to connect to bugreport service");
        event.returnValue = 'CantConnect';
        return;
    }
    
    request.on('response', (response) => {
        result["status_code"] = response.statusCode;

        var responseBody = "";
        response.on('data', (chunk) => {
            responseBody += chunk;
        });

        response.on('end', () => {
            result["body"] = responseBody;
            log.info("Bug report response: " + JSON.stringify(result));
            callback(result);
        });
    });
    request.on('error', (error) => {
        log.error("Error occurred when submitting bug report: " + error.message);
        result['raw_error'] = error.message;
        callback(result);
    });

    var requestBody = new object();
    requestBody.name = name;
    requestBody.email = email;
    requestBody.description = description;
    // TODO: Logs
    request.write(JSON.stringify(requestBody));
    request.end();

};

export default {call}