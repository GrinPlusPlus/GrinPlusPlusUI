const WebSocket = require("ws");
const NodeCrypto = require("crypto");
import GrinboxCrypto from './Crypto';
import GrinboxUtils from './GrinboxUtils';

import Receive from '../client/api/owner/Receive';
import Finalize from '../client/api/owner/Finalize';

var socket;
var lastAction = null;
var mainWindow = null;

function encryptMessage(destination, slate) {
    // Encrypt slate
    const salt = NodeCrypto.randomBytes(8);
    const nonce = NodeCrypto.randomBytes(12);
    const shared_secret = GrinboxCrypto.ECDH(global.grinbox_secret_key, GrinboxUtils.parsePublicKey(destination.public_key));
    const key = GrinboxCrypto.PBKDF2(shared_secret, salt);
    const encrypted_slate = GrinboxCrypto.AEAD_Encrypt(nonce, key, JSON.stringify(slate));

    // Create EncryptedMessage
    var encrypted_message = new Object();
    encrypted_message.salt = salt.toString('hex');
    encrypted_message.nonce = nonce.toString('hex');
    encrypted_message.encrypted_message = encrypted_slate;
    encrypted_message.destination = destination;

    return encrypted_message;
}

function decryptMessage(encrypted_message, from_address) {
    const shared_secret = GrinboxCrypto.ECDH(global.grinbox_secret_key, GrinboxUtils.parsePublicKey(from_address));
    const key = GrinboxCrypto.PBKDF2(shared_secret, Buffer.from(encrypted_message.salt, 'hex'));

    return GrinboxCrypto.AEAD_Decrypt(encrypted_message.nonce, key, Buffer.from(encrypted_message.encrypted_message, 'hex'));
}

function postSlate(slate, to_address) {
    // Create Destination
    var destination = new Object();
    destination.public_key = to_address;
    destination.domain = "grinbox.io"; // TODO: Support custom domain
    destination.port = 443; // TODO: Support custom port

    const encrypted_message = encryptMessage(destination, slate);

    // Create PostSlate Message
    var post_slate_message = new Object();
    post_slate_message.type = "PostSlate";
    post_slate_message.from = global.grinbox_address;
    post_slate_message.to = to_address;
    post_slate_message.str = JSON.stringify(encrypted_message);
    post_slate_message.signature = GrinboxCrypto.signMessage(Buffer.from(global.grinbox_secret_key, 'hex'), post_slate_message.str);
    // TODO: post_slate_message.message_expiration_in_seconds

    // Send message
    const json_str = JSON.stringify(post_slate_message);
    lastAction = 'sent';
    socket.send(json_str);
}

function processSlateMessage(message) {
    // TODO: Verify signature

    const encrypted_message = JSON.parse(message.str);
    const decrypted = decryptMessage(encrypted_message, message.from);
    const slate = JSON.parse(decrypted);
    
    if (slate.num_participants > slate.participant_data.length) {
        Receive.call(JSON.stringify(slate), function (result) {
            if (result.status_code == 200) {
                lastAction = 'received';
                postSlate(result.slate, message.from);
            } else {
                mainWindow.webContents.send("Grinbox::Status", "ERROR", "Failed to receive Grinbox transaction.");
            }
        });
    } else {
        Finalize.call(JSON.stringify(slate), function (result) {
            if (result.status_code == 200) {
                mainWindow.webContents.send("Grinbox::Status", "SUCCESS", "Grinbox transaction finalized.");
            } else {
                mainWindow.webContents.send("Grinbox::Status", "ERROR", "Failed to finalize Grinbox transaction.");
            }
        });
    }
}

function connect(window) {
    mainWindow = window;
    socket = new WebSocket("wss://grinbox.io:443");

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        if (message.type == 'Challenge') {
            global.grinbox_challenge = message.str;
        } else if (message.type == 'Slate') {
            processSlateMessage(message);
        } else if (message.type == 'Error') {
            if (lastAction == 'received') {
                mainWindow.webContents.send("Grinbox::Status", "ERROR", "Failed to receive Grinbox transaction.");
            } else if (lastAction == 'sent') {
                mainWindow.webContents.send("Grinbox::Status", "ERROR", "Failed to send Grinbox transaction.");
            }

            lastAction = null;
        } else if (message.type == 'Ok') {
            if (lastAction == 'received') {
                mainWindow.webContents.send("Grinbox::Status", "SUCCESS", "Grinbox transaction received.");
            } else if (lastAction == 'sent') {
                mainWindow.webContents.send("Grinbox::Status", "SUCCESS", "Grinbox transaction sent.");
            }

            lastAction = null;
        } else {
            console.log("Unknown websocket event received: " + event.data);
        }
    }
}

function disconnect() {
    socket = null;
}

function subscribe(secret_key, address) {
    global.grinbox_secret_key = secret_key;
    global.grinbox_address = address;

    let privateKey = Buffer.from(secret_key, 'hex');
    let signedChallenge = GrinboxCrypto.signMessage(privateKey, global.grinbox_challenge);

    var subscribe_message = new Object();
    subscribe_message.type = "Subscribe";
    subscribe_message.address = address;
    subscribe_message.signature = signedChallenge;

    socket.send(JSON.stringify(subscribe_message));
}

function unsubscribe() {
    var unsubscribe_message = new Object();
    unsubscribe_message.type = "Unsubscribe";
    unsubscribe_message.address = global.grinbox_address;

    socket.send(JSON.stringify(unsubscribe_message));

    global.grinbox_secret_key = null;
    global.grinbox_address = null
}

export default { connect, disconnect, subscribe, unsubscribe, postSlate };