import { ipcMain } from 'electron';
import log from 'electron-log';
const http = require('http');
const localtunnel = require('localtunnel');

var tunnel = null;
var proxy_url = "";
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
                ipAddress = "" + chunk + ":" + global.listener_port;
                lastLookup = Date.now();
                event.returnValue = {
                    proxy: proxy_url,
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
            proxy: proxy_url,
            IP: ipAddress,
            expiration: expiration
        };
    }
}

function connect($callback) {

    (async function ($callback) {
        if (tunnel != null) {
            tunnel.close();
        }
        
        expiration = new Date();
        expiration.setTime(expiration.getTime() + (8 * 60 * 60 * 1000));

        tunnel = await localtunnel({
            port: global.listener_port,
            host: 'http://localtunnel.me'
        });
    
        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
        proxy_url = tunnel.url.replace('https://', 'http://');
        
        tunnel.on('close', () => {
            proxy_url = "";
        });

        
        if ($callback != null) {
            $callback();
        }
    })($callback);
}

function disconnect() {
    proxy_url = "";
    if (tunnel != null) {
        tunnel.close();
    }
}

export default { start, connect, disconnect }