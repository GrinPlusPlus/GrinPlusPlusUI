const base58 = require('bs58check');

function parseAddress(address) {
    try {
        var grinboxAddress = new Object();

        var sanitizedAddress = address;
        if (sanitizedAddress.startsWith('grinbox://')) {
            sanitizedAddress = sanitizedAddress.substring(10);
        }

        var parts = sanitizedAddress.split('@');
        grinboxAddress["address"] = parts[0];
        if (parts.length == 2) {
            var host = parts[1];
            const hostParts = host.split(':');
            grinboxAddress["domain"] = hostParts[0];

            if (hostParts.length == 2) {
                grinboxAddress["port"] = parseInt(hostParts[1]);
            } else {
                grinboxAddress["port"] = 443;
            }
        } else {
            grinboxAddress["domain"] = "grinbox.io";
            grinboxAddress["port"] = 443;
        }

        return grinboxAddress;
    } catch (e) {
        return null;
    }
}

function parsePublicKey(b58Address) {
    let decoded = base58.decode(b58Address);
    return decoded.slice(2);
}

function encodePublicKey(hexPublicKey) {
    let withVersion = "010B" + hexPublicKey;
    let publicKeyBuffer = Buffer.from(withVersion, 'hex');
    return base58.encode(publicKeyBuffer)
}

export default { parseAddress, parsePublicKey, encodePublicKey }