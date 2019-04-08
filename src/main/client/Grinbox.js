const base58 = require('bs58check');

exports.parseAddress = function (address) {
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

        base58.decode(grinboxAddress["address"]);

        return grinboxAddress;
    } catch (e) {
        return null;
    }
}