import Send from './api/owner/Send';
import ForeignReceive from './api/ForeignReceive';
import Finalize from './api/owner/Finalize';
import ConnectionUtils from './ConnectionUtils';
import log from 'electron-log';

async function callFinalize(slate, grinjoin, callback) {
    Finalize.call(slate, null, grinjoin, function (finalizeResult, error) {
        log.info("Finalize Result: " + JSON.stringify(finalizeResult));

        if (finalizeResult != null && finalizeResult.result != null) {
            callback({
                success: true,
                status: finalizeResult
            });
        } else {
            log.error("Finalize failed with error: " + JSON.stringify(finalizeResult.error));
            callback({
                success: false,
                status: finalizeResult
            });
        }
    });
}

async function callReceive(httpAddress, slate, grinjoin, callback) {
    ForeignReceive.callRPC(httpAddress, slate, function (receiveResult) {
        log.info("Receive Result: " + JSON.stringify(receiveResult));

        if (receiveResult.success == true) {
            callFinalize(receiveResult.slate, grinjoin, callback);
        } else {
            log.error("Receive failed with status: " + receiveResult.status_code);
            callback({
                success: false,
                status: receiveResult
            });
        }
    });
}

async function callSend(httpAddress, amount, strategy, inputs, message, grinjoin, callback) {
    Send.call(amount, strategy, inputs, httpAddress, message, false, function (result) {
        if (result.success === true) {
            callReceive(httpAddress, result.data.slate, grinjoin, callback);
        } else {
            log.error("Send failed with error: " + result.message);
            callback(result);
        }
    });
}

async function call(httpAddress, amount, strategy, inputs, message, grinjoin, callback) {
    log.info("Sending to: " + httpAddress);
    const canConnect = await ConnectionUtils.canConnect(httpAddress, ForeignReceive.RECEIVE_TX_PATH);
    if (!canConnect) {
        log.error("Failed to connect");
        callback({
            success: false,
            status: 'CantConnect'
        });
        return;
    }

    callSend(httpAddress, amount, strategy, inputs, message, grinjoin, callback);
};

export default {call}