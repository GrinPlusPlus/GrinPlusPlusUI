import RPCClient from '../RPCClient';

const GRINJOIN_ADDRESS = "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid";

function call(slate, file, grinjoin, callback) {
    var reqJSON = new Object();
    reqJSON['session_token'] = global.session_token;
    reqJSON['slate'] = slate;

    if (file != null) {
        reqJSON['file'] = file;
    }

    var postJSON = new Object();
    if (grinjoin == true) {
        postJSON['method'] = 'JOIN';
        postJSON['grinjoin_address'] = GRINJOIN_ADDRESS;
    } else {
        postJSON['method'] = 'STEM';
    }
    reqJSON["post_tx"] = postJSON;

    RPCClient.call('finalize', reqJSON, function (result, error) {
        callback(result, error);
    });
}

export default {call}