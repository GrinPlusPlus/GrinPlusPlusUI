import ConnectionUtils from '../../ConnectionUtils';

function call(amount, strategy, inputs, callback) {
    const headers = [{ name: 'session_token', value: global.session_token }];

    var reqJSON = new Object();
    reqJSON['amount'] = amount;
    reqJSON['fee_base'] = 1000000;
    reqJSON['selection_strategy'] = {
        strategy: strategy,
        inputs: inputs
    };

    ConnectionUtils.ownerRequest('GET', 'estimate_fee', headers, JSON.stringify(reqJSON), function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;

        if (response.status_code == 200) {
            const body = JSON.parse(response.body);

            result["fee"] = body.fee;
            result["inputs"] = body.inputs;
        }

        callback(result);
    });
}

export default {call}