import { ipcMain } from 'electron';
const http = require('http');

function start() {
    var lastLookup = new Date(0);
    var ipAddress = null;
    
    ipcMain.on('LookupIP', (event) => {
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
                    event.returnValue = ipAddress;
                });
            }).on('error', function (e) {
                console.log("error: " + e.message);
                event.returnValue = ipAddress;
            });
        } else {
            event.returnValue = ipAddress;
        }
    });
}

export default {start}