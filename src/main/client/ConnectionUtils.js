import { net } from 'electron';
import { URL } from 'url';

const OWNER_PORT = 3420;
const FOREIGN_PORT = 3415;
const NODE_PORT = 3413;

function getPort(url) {
    var port = url.port;
    if (port.length == 0) {
        if (url.protocol == "https:") {
            port = "443";
        } else {
            port = '' + FOREIGN_PORT;
        }
    }

    return port;
}

function buildForeignRequest(httpAddress, pathToAppend) {
    try {
        const url = new URL(httpAddress);

        var pathname = url.pathname;
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1) + pathToAppend;
        } else {
            pathname = pathname + pathToAppend;
        }

        const port = getPort(url);

        return net.request({
            method: 'POST',
            protocol: url.protocol,
            hostname: url.hostname,
            port: parseInt(port),
            path: pathname
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

// TODO: Implement this
async function canConnect(httpAddress, pathToAppend) {
    return buildForeignRequest(httpAddress, pathToAppend) == null ? false : true;
}

function localRequest(httpMethod, portNumber, path, headers, requestBody, callback) {
    var result = new Object();
    result['status_code'] = 404;

    try {
        const req = net.request({
            method: httpMethod,
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: portNumber,
            path: path
        });

        if (headers != null) {
            for (var i = 0; i < headers.length; i++) {
                req.setHeader(headers[i].name, headers[i].value);
            }
        }

        req.on('response', (response) => {
            result["status_code"] = response.statusCode;

            var responseBody = "";
            response.on('data', (chunk) => {
                responseBody += chunk;
            });

            response.on('end', () => {
                result["body"] = responseBody;
                callback(result);
            });
        });
        req.on('error', (error) => {
            console.log(error);
            result['raw_error'] = error.message;
            callback(result);
        });
        req.write(requestBody);
        req.end();
    } catch (err) {
        console.log(err);
        result["raw_error"] = err.message;
        callback(result);
    }
}

function ownerRequest(httpMethod, action, headers, requestBody, callback) {
    localRequest(httpMethod, OWNER_PORT, '/v1/wallet/owner/' + action, headers, requestBody, callback);
}

function nodeRequest(httpMethod, path, requestBody, callback) {
    localRequest(httpMethod, NODE_PORT, path, [], requestBody, callback);
}

export default { OWNER_PORT, FOREIGN_PORT, NODE_PORT, buildForeignRequest, canConnect, ownerRequest, nodeRequest };