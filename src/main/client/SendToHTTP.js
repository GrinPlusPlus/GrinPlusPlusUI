import Send from './api/owner/Send';
import ForeignReceive from './api/ForeignReceive';
import Finalize from './api/owner/Finalize';
import ConnectionUtils from './ConnectionUtils';
import log from 'electron-log';

async function call(event, httpAddress, amount, strategy, inputs, message) {
    log.info("Sending to: " + httpAddress);
    const canConnect = await ConnectionUtils.canConnect(httpAddress, ForeignReceive.RECEIVE_TX_PATH);
    if (!canConnect) {
        log.error("Failed to connect");
        event.returnValue = 'CantConnect';
        return;
    }

    Send.call(amount, strategy, inputs, httpAddress, message, function (sendResult) {
        log.info("Send Result: " + JSON.stringify(sendResult));

        if (sendResult.status_code == 200) {
            ForeignReceive.callRPC(httpAddress, sendResult.slate, function (receiveResult) {
                log.info("Receive Result: " + JSON.stringify(receiveResult));

                if (receiveResult.success == true) {
                    Finalize.call(JSON.stringify(receiveResult.slate), function (finalizeResult) {
                        log.info("Finalize Result: " + JSON.stringify(finalizeResult));

                        if (finalizeResult.status_code == 200) {
                            event.returnValue = finalizeResult;
                        } else {
                            log.error("Finalize failed with status: " + finalizeResult.status_code);
                            event.returnValue = finalizeResult;
                        }
                    });
                } else {
                    log.error("Receive failed with status: " + receiveResult.status_code);
                    event.returnValue = receiveResult;
                }
            });
        } else {
            log.error("Send failed with status: " + sendResult.status_code);
            event.returnValue = sendResult;
        }
    });
};

export default {call}