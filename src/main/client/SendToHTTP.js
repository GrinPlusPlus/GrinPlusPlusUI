import Send from './api/owner/Send';
import ForeignReceive from './api/ForeignReceive';
import Finalize from './api/owner/Finalize';
import ConnectionUtils from './ConnectionUtils';

async function call(event, httpAddress, amount) {
    const canConnect = await ConnectionUtils.canConnect(httpAddress, ForeignReceive.RECEIVE_TX_PATH);
    if (!canConnect) {
        event.returnValue = 'ContConnect';
        return;
    }

    Send.call(amount, function (sendResult) {
        console.log("Send Result:");
        console.log(sendResult);

        if (sendResult.status_code == 200) {
            ForeignReceive.call(httpAddress, JSON.stringify(sendResult.slate), function (receiveResult) {
                console.log("Receive Result:");
                console.log(receiveResult);

                if (receiveResult.status_code == 200) {
                    Finalize.call(JSON.stringify(receiveResult.slate), function (finalizeResult) {
                        console.log("Finalize Result:");
                        console.log(finalizeResult);

                        if (finalizeResult.status_code == 200) {
                            event.returnValue = finalizeResult;
                        } else {
                            event.returnValue = "FinalizeFailed";
                        }
                    });
                } else {
                    event.returnValue = "ForeignReceiveFailed";
                }
            });
        } else {
            event.returnValue = "SendSlateFailed";
        }
    });
};

export default {call}