import GrinboxSocket from './GrinboxSocket';
import GrinboxUtils from './GrinboxUtils';
import Snackbar from '../Snackbar';
import log from 'electron-log';

var grinbox_socket = null;

function init() {
    if (grinbox_socket === null) {
        try {
            grinbox_socket = new GrinboxSocket();
            grinbox_socket.connect();
        } catch (e) {
            log.error("Failed to connect to grinbox. ERROR: " + e.message + '\n' + e.stack);
            Snackbar.sendError("Failed to connect to grinbox.");
        }
    }
}

function shutdown() {
    if (grinbox_socket !== null) {
        try {
            grinbox_socket.disconnect();
        } catch (e) {
            log.error("Failed to disconnect from grinbox. ERROR: " + e.message + '\n' + e.stack);
        }

        grinbox_socket = null;
    }
}

function subscribe(secret_key, public_key) {
    if (grinbox_socket !== null) {
        try {
            const grinbox_address = GrinboxUtils.encodePublicKey(public_key);
            grinbox_socket.subscribe(Buffer.from(secret_key, 'hex'), grinbox_address);
        } catch (e) {
            log.error("Failed to subscribe to grinbox address. ERROR: " + e.message + '\n' + e.stack);
            Snackbar.sendError("Failed to subscribe to grinbox address.");
        }
    }
}

function unsubscribe() {
    if (grinbox_socket !== null) {
        try {
            grinbox_socket.unsubscribe();
        } catch (e) {
            log.error("Failed to unsubscribe from grinbox address. ERROR: " + e.message + '\n' + e.stack);
        }
    }
}

function sendSlate(slate, to_address) {
    if (grinbox_socket !== null) {
        try {
            grinbox_socket.postSlate(slate, to_address, "Send");
        } catch (e) {
            log.error("Failed to post slate to " + to_address + ". ERROR: " + e.message + '\n' + e.stack);
            Snackbar.sendError("Failed to send grinbox transaction.");
        }
    }
}

function getAddress() {
    if (grinbox_socket !== null) {
        return grinbox_socket.grinbox_address;
    }

    return "";
}

function getStatus() {
    if (grinbox_socket !== null) {
        return grinbox_socket.subscribed;
    }

    return false;
}

export default { init, shutdown, subscribe, unsubscribe, sendSlate, getAddress, getStatus };