const pbkdf2 = require('pbkdf2');
const hash = require('hash.js')
const elliptic = require('elliptic');
const EC = elliptic.ec;
const secp256k1 = new EC(elliptic.curves['secp256k1']);
const chacha = require('chacha-js');

function signMessage(secretKey, message) {
    const keys = secp256k1.keyFromPrivate(secretKey);
    const digest = hash.sha256().update(Buffer.from(message)).digest();
    const signature = secp256k1.sign(digest, keys, 'hex', { canonical: true }).toDER("hex");
    return signature.toString();
}

function verifySignature(publicKey, message, signature) {
    return secp256k1.verify(message, signature, publicKey);
}

function PBKDF2(sharedSecret, salt) {
    return pbkdf2.pbkdf2Sync(Buffer.from(sharedSecret, 'hex'), Buffer.from(salt, 'hex'), 100, 32, 'sha512')
}

function ECDH(secretKey, publicKey) {
    const keys = secp256k1.keyFromPrivate(secretKey);
    const shared_secret = keys.derive(secp256k1.keyFromPublic(publicKey).getPublic()).toString(16);
    return shared_secret;
}

function AEAD_Encrypt(nonce, key, plaintext) {
    const cipher = chacha.createCipher(Buffer.from(key, 'hex'), Buffer.from(nonce, 'hex'));

    var data = [];
    cipher.on('data', function (d) {
        data.push(d);
    });

    cipher.write(plaintext);
    cipher.end();
    const authTag = cipher.getAuthTag();

    return Buffer.concat(data).toString('hex') + authTag.toString('hex');
}

function AEAD_Decrypt(nonce, key, ciphertext) {
    const decipher = chacha.createDecipher(Buffer.from(key, 'hex'), Buffer.from(nonce, 'hex'));

    var data = [];
    decipher.on('data', function (d) {
        data.push(d);
    });

    const encryptedLength = ciphertext.length - 16;
    const encrypted = ciphertext.slice(0, encryptedLength);
    decipher.write(encrypted);

    const authTag = ciphertext.slice(encryptedLength);
    console.log("AuthTag: " + authTag)
    decipher.setAuthTag(authTag);

    decipher.end();

    return Buffer.concat(data).toString();
}

export default { signMessage, verifySignature, ECDH, PBKDF2, AEAD_Encrypt, AEAD_Decrypt }