
//var ERRORS = new Map(
//    ['RECEIVER_UNREACHABLE', 'Failed to connect to receiver.']
//);

function getErrorMsg(type) {
    if (type == 'RECEIVER_UNREACHABLE') {
        return 'Failed to connect to receiver.';
    }
}

export default { getErrorMsg }