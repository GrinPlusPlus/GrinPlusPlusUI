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
    ipcMain.on('LookupProxy', (event) => {
        const currentDate = new Date();
        if (expiration == null || currentDate > expiration) {
            connect(() => {
                if (global.mainWindow != null) {
                    global.mainWindow.webContents.send("LookupProxy::Response", proxy_url, expiration);
                }
            });
        } else {
            if (global.mainWindow != null) {
                global.mainWindow.webContents.send("LookupProxy::Response", proxy_url, expiration);
            }
        }
    });

    ipcMain.on('LookupIP', (event) => {
        lookupIP();
    });
}

function lookupIP() {
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
                ipAddress = "http://" + chunk + ":" + global.listener_port;
                lastLookup = Date.now();
                if (global.mainWindow != null) {
                    global.mainWindow.webContents.send("LookupIP::Response", ipAddress, global.listener_port);
                }
            });
        }).on('error', function (e) {
            log.error("Failed to retrieve IP: " + e.message);

            if (global.mainWindow != null) {
                global.mainWindow.webContents.send("LookupIP::Response", ipAddress, global.listener_port);
            }
        });
    } else {
        if (global.mainWindow != null) {
            global.mainWindow.webContents.send("LookupIP::Response", ipAddress, global.listener_port);
        }
    }
}

function connect($callback) {

    (async function ($callback) {
        if (tunnel != null) {
            tunnel.close();
        }
        
        try {
            expiration = new Date();
            expiration.setTime(expiration.getTime() + (8 * 60 * 60 * 1000));

            log.info("Connecting to localtunnel");
            tunnel = await localtunnel({
                port: global.listener_port,
                host: 'http://localtunnel.me'
            });
            log.info("Connected");
        
            // the assigned public url for your tunnel
            // i.e. https://abcdefgjhij.localtunnel.me
            proxy_url = tunnel.url.replace('https://', 'http://');
            
            tunnel.on('close', () => {
                proxy_url = "";
            });
        } catch (e) {
            log.info("localtunnel error: " + e.message);
        }
        
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