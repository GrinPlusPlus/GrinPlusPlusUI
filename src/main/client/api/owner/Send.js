import RPCClient from '../RPCClient';

const GRINJOIN_ADDRESS = "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid";

function call(amount, strategy, inputs, address, message, grinjoin, callback) {
    var reqJSON = new Object();
    reqJSON['session_token'] = global.session_token;
    reqJSON['amount'] = amount;
    reqJSON['fee_base'] = 1000000;
    reqJSON['selection_strategy'] = {
        strategy: strategy,
        inputs: inputs
    };

    reqJSON['address'] = address;

    if (message != null && message.length > 0) {
        reqJSON['message'] = message;
    }

    var postJSON = new Object();
    if (grinjoin == true) {
        postJSON['method'] = 'JOIN';
        postJSON['grinjoin_address'] = GRINJOIN_ADDRESS;
    } else {
        postJSON['method'] = 'STEM';
    }
    reqJSON["post_tx"] = postJSON;

    RPCClient.call('send', reqJSON, function (response, error) {
        if (error != null) {
            callback({
                success: false,
                data: error
            });
        } else if (response.error != null) {
            callback({
                success: false,
                message: response.error.message,
                data: response.error.data
            });
        } else {
            callback({
                success: true,
                data: response.result
            });
        }
    });
}

export default {call}