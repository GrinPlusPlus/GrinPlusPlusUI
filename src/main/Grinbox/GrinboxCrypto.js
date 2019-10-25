import Crypto from '../Crypto';
const NodeCrypto = require('crypto');
import GrinboxUtils from './GrinboxUtils';
import log from 'electron-log';

function signMessage(secretKey, message) {
    return Crypto.signMessage(secretKey, message);
}

function encryptMessage(secret_key, destination, slate) {
    log.info("Encrypting slate for Grinbox: " + JSON.stringify(slate));

    // Encrypt slate
    const salt = NodeCrypto.randomBytes(8);
    const nonce = NodeCrypto.randomBytes(12);
    const shared_secret = Crypto.ECDH(secret_key, GrinboxUtils.parsePublicKey(destination.public_key));
    const key = Crypto.PBKDF2(shared_secret, salt);
    const encrypted_slate = Crypto.AEAD_Encrypt(nonce, key, JSON.stringify(slate));

    // Create EncryptedMessage
    var encrypted_message = new Object();
    encrypted_message.salt = salt.toString('hex');
    encrypted_message.nonce = nonce.toString('hex');
    encrypted_message.encrypted_message = encrypted_slate;
    encrypted_message.destination = destination;

    return encrypted_message;
}

function decryptMessage(secret_key, encrypted_message, from_address) {
    const shared_secret = Crypto.ECDH(secret_key, GrinboxUtils.parsePublicKey(from_address));
    const key = Crypto.PBKDF2(shared_secret, Buffer.from(encrypted_message.salt, 'hex'));

    return Crypto.AEAD_Decrypt(encrypted_message.nonce, key, Buffer.from(encrypted_message.encrypted_message, 'hex'));
}

export default { signMessage, encryptMessage, decryptMessage }