const WebSocket = require("ws");
import GrinboxCrypto from './GrinboxCrypto';
import log from 'electron-log';
import Snackbar from '../Snackbar';

import Receive from '../client/api/owner/Receive';
import Finalize from '../client/api/owner/Finalize';

class GrinboxSocket {
    constructor() {
        this.socket = null;
        this.secret_key = null;
        this.grinbox_address = null;
        this.challenge = null;
        this.subscribed = false;
        this.shutdown = false;
        this.num_failures = 0;
        this.last_message_sent = null;
    }

    connect() {
        log.info("GrinboxSocket::connect - Connecting");

        this.shutdown = false;
        this.socket = new WebSocket("wss://grinbox.io:443");
        const _this = this;

        this.socket.onopen = function (e) {
            log.info("GrinboxSocket::connect - Connected");

            _this.num_failures = 0;
            if (_this.secret_key != null) {
                subscribe(_this.secret_key, _this.grinbox_address);
            }
        }

        this.socket.onerror = function (e) {
            log.error("GrinboxSocket: Error thrown - " + e.message);
            if (_this.socket.readyState !== _this.socket.CLOSED && _this.socket.readyState !== _this.socket.CLOSING) {
                _this.socket.close();
            }
        }

        this.socket.onclose = function (e) {
            _this.challenge = null;
            _this.subscribed = false;

            if (!_this.shutdown) {
                if (_this.num_failures == 0) {
                    log.warn("GrinboxSocket: Lost connection to grinbox");
                    Snackbar.sendError("Lost connection to grinbox.");
                }

                _this.num_failures++;

                // TODO: Don't believe onclose will get called if it fails to reconnect. Need a setRecurring instead or something
                setTimeout(() => {
                    _this.connect();
                }, Math.pow(2, _this.num_failures) * 1000);
            }
        }

        this.socket.onmessage = function (event) {
            log.info("GrinboxSocket: Message received: " + event.data);
            const message = JSON.parse(event.data);

            if (message.type == 'Challenge') {
                _this.challenge = message.str;
                console.log(_this.challenge);
            } else if (message.type == 'Slate') {
                _this.processSlateMessage(message);
            } else if (message.type == 'Error') {
                if (_this.last_message_sent == 'Receive') {
                    Snackbar.sendError("Failed to receive Grinbox transaction.");
                } else if (_this.last_message_sent == 'Send') {
                    Snackbar.sendError("Failed to send Grinbox transaction.");
                } else if (_this.last_message_sent == "Subscribe") {
                    // TODO: Retry?
                    Snackbar.sendError("Failed to subscribe to grinbox address.")
                } else if (_this.last_message_sent == "Unsubscribe") {
                    // Do nothing?
                }

                log.error("GrinboxSocket: " + error.kind + " error received from grinbox with description: " + error.description);
                _this.last_message_sent = null;
            } else if (message.type == 'Ok') {
                if (_this.last_message_sent == 'Receive') {
                    // TODO: Refresh wallet
                    Snackbar.sendSuccess("Grinbox transaction received.");
                } else if (_this.last_message_sent == 'Send') {
                    Snackbar.sendSuccess("Grinbox transaction sent.");
                } else if (_this.last_message_sent == "Subscribe") {
                    _this.subscribed = true;
                    Snackbar.sendSuccess("Connected to Grinbox.");
                } else if (_this.last_message_sent == "Unsubscribe") {
                    // Do nothing?
                }

                _this.last_message_sent = null;
            } else {
                log.info("Unknown websocket event received: " + event.data);
            }
        }
    }

    disconnect() {
        log.info("GrinboxSocket::disconnect - Disconnecting from grinbox.");
        this.shutdown = true;
        if (this.socket.readyState !== this.socket.CLOSED && this.socket.readyState !== this.socket.CLOSING) {
            this.socket.close();
        }
    }

    sendMessage(messageJson, type) {
        const messageStr = JSON.stringify(messageJson);
        if (this.socket.readyState !== this.socket.OPEN) {
            log.warn("GrinboxSocket::sendMessage - Can't send message: " + messageStr);
            return;
        }

        log.info("GrinboxSocket::sendMessage - Sending message: " + messageStr);
        this.last_message_sent = (type != null ? type : messageJson.type);
        this.socket.send(messageStr);
    }

    subscribe(secret_key, grinbox_address) {
        if (this.subscribed) {
            this.unsubscribe();
        }

        this.secret_key = secret_key;
        this.grinbox_address = grinbox_address;
        let signedChallenge = GrinboxCrypto.signMessage(secret_key, this.challenge);
        log.info("Signed");

        this.sendMessage({
            type: "Subscribe",
            address: grinbox_address,
            signature: signedChallenge
        });
    }

    unsubscribe() {
        if (this.grinbox_address == null || !this.subscribed) {
            log.warn("GrinboxSocket::unsubscribe - Already unsubscribed.");
            return;
        }

        this.sendMessage({
            type: "Unsubscribe",
            address: this.grinbox_address
        });

        this.secret_key = null;
        this.grinbox_address = null;
        this.subscribed = false;
    }
    
    postSlate(slate, to_address, action) {
        log.info("GrinboxSocket::postSlate - Preparing to post slate to " + to_address);

        // Create Destination
        const destination = {
            public_key: to_address,
            domain: "grinbox.io", // TODO: Support custom domain
            port: 443 // TODO: Support custom port
        };

        const encrypted_message = JSON.stringify(GrinboxCrypto.encryptMessage(this.secret_key, destination, slate));
        const messageSig = GrinboxCrypto.signMessage(this.secret_key, encrypted_message);

        // Create PostSlate Message
        this.sendMessage({
            type: "PostSlate",
            from: this.grinbox_address,
            to: to_address,
            str: encrypted_message,
            signature: messageSig
            // TODO: message_expiration_in_seconds
        }, action);
    }
    
    processSlateMessage(message) {
        log.info("Processing slate message: " + message.str + " from: " + message.from);

        // TODO: Verify signature
        const encrypted_message = JSON.parse(message.str);
        const decrypted = GrinboxCrypto.decryptMessage(this.secret_key, encrypted_message, message.from);
        const slate = JSON.parse(decrypted);

        if (slate.num_participants > slate.participant_data.length) {
            log.info("GrinboxSocket::processSlateMessage - Receiving slate");

            const _this = this;
            Receive.call(JSON.stringify(slate), message.from, "", function (result) {
                log.info("Receive result: " + JSON.stringify(result));
                if (result.status_code == 200) {
                    _this.postSlate(result.slate, message.from, "Receive");
                } else {
                    Snackbar.sendError("Failed to receive Grinbox transaction.");
                }
            });
        } else {
            log.info("GrinboxSocket::processSlateMessage - Finalizing slate");

            Finalize.call(JSON.stringify(slate), function (result) {
                log.info("Finalize result: " + JSON.stringify(result));
                if (result.status_code == 200) {
                    Snackbar.sendSuccess("Grinbox transaction finalized.");
                } else {
                    Snackbar.sendError("Failed to finalize Grinbox transaction.");
                }
            });
        }
    }
}

export default GrinboxSocket;