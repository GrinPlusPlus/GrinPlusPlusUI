import { ipcMain } from 'electron';
import log from 'electron-log';
const http = require('http');
const ngrok = require('ngrok');

function start() {
    var lastLookup = new Date(0);
    var ipAddress = "";

    (async function() {
       const url = await ngrok.connect({
            proto: 'http', // http|tcp|tls, defaults to http
            addr: 3415, // port or network address, defaultst to 80
            //auth: 'user:pwd', // http basic authentication for tunnel
            region: 'us', // one of ngrok regions (us, eu, au, ap), defaults to us
            binPath: function(value) { return value.replace('app.asar', 'app.asar.unpacked'); }
        });

        ipAddress = url;
    })();
    
    ipcMain.on('LookupIP', (event) => {
        event.returnValue = ipAddress;
    });
}

export default {start}