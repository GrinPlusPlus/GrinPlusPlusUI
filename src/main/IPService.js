import { ipcMain } from 'electron';
import log from 'electron-log';
const http = require('http');

var ngrok_url = "";
var ipAddress = "";
var lastLookup = null;
var expiration = null;

function start() {
    ipcMain.on('LookupURL', (event) => {
        const currentDate = new Date();
        if (expiration == null || currentDate > expiration) {
            connect(() => {
                lookupIP(event);
            });
        } else {
            lookupIP(event);
        }
    });
}

function lookupIP(event) {
    const currentDate = Date.now();
    const secondsSinceLastLookup = (currentDate - lastLookup) / 1000;

    if (secondsSinceLastLookup > 60) {
        console.log("Looking up IP Address");

        const options = {
            host: 'ipv4bot.whatismyipaddress.com',
            port: 80,
            path: '/'
        };

        http.get(options, function (res) {
            res.on("data", function (chunk) {
                ipAddress = chunk;
                lastLookup = Date.now();
                event.returnValue = {
                    ngrok: ngrok_url,
                    IP: ipAddress,
                    expiration: expiration
                };
            });
        }).on('error', function (e) {
            log.error("Failed to retrieve IP: " + e.message);
            event.returnValue = ipAddress;
        });
    } else {
        event.returnValue = event.returnValue = {
            ngrok: ngrok_url,
            IP: ipAddress,
            expiration: expiration
        };
    }
}

function connect($callback) {
    if (process.platform !== 'darwin') {
        const ngrok = require('ngrok');

        (async function ($callback) {
            if (ngrok_url.length > 0) {
                ngrok.disconnect(ngrok_url);
            }

            ngrok_url = "";
            expiration = new Date();
            expiration.setTime(expiration.getTime() + (8 * 60 * 60 * 1000));

            ngrok_url = await ngrok.connect({
                proto: 'http', // http|tcp|tls, defaults to http
                addr: 3415, // port or network address, defaultst to 80
                //auth: 'user:pwd', // http basic authentication for tunnel
                region: 'us', // one of ngrok regions (us, eu, au, ap), defaults to us
                binPath: function (value) { return value.replace('app.asar', 'app.asar.unpacked'); }
            });

            if ($callback != null) {
                $callback();
            }
        })($callback);
    } else if ($callback != null) {
        $callback();
    }
}

function disconnect() {
    ngrok_url = "";
    if (process.platform !== 'darwin') {
        const ngrok = require('ngrok');
        ngrok.disconnect();
    }
}

export default { start, connect, disconnect }