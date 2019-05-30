import ConnectionUtils from '../../ConnectionUtils';

function call(event, txId) {
    const headers = [{ name: 'session_token', value: global.session_token }];
    ConnectionUtils.ownerRequest('GET', 'retrieve_txs?id=' + txId, headers, '', function (response) {
        var result = new Object();
        result["status_code"] = response.status_code;


        if (response.status_code == 200) {
            result["body"] = response.body;
            const json = JSON.parse(response.body);
            if (json.transactions !== null && json.transactions.length >= 1) {
                const transaction = json.transactions[0];
                result["id"] = transaction.id;
                result["slate_id"] = transaction.slate_id;
                result["fee"] = transaction.fee;
                result["slate_message"] = transaction.slate_message;
                result["amount_credited"] = transaction.amount_credited;
                result["amount_debited"] = transaction.amount_debited;
                result["creation_date_time"] = transaction.creation_date_time;
                result["confirmation_date_time"] = transaction.confirmation_date_time;
                result["confirmed_height"] = transaction.confirmed_height;

                result["outputs"] = transaction.outputs;
            }
        }

        event.returnValue = result;
    });
}

export default {call}