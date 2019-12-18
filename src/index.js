import { app, BrowserWindow, dialog } from 'electron';
const { autoUpdater } = require('electron-updater');
import ChildProcess from 'child_process';
import Client from './main/client/Client';
import FileListener from './main/FileListener';
import IPService from './main/IPService';
import Updater from './main/Updater.js';
import {version} from '../package.json';
import Config from './main/Config';
import log from 'electron-log';
import fs from 'fs';
const unhandled = require('electron-unhandled');

const isDevMode = process.execPath.match(/[\\/]electron/);
const isWindows = process.platform == "win32";
const FLOONET = false;
const LAUNCH_NODE = !isDevMode || false;

//import { enableLiveReload } from 'electron-compile';
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

if (isDevMode) {
    //enableLiveReload({ strategy: 'react-hmr' });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let binDirectory = `${__dirname}/bin/`;
binDirectory = binDirectory.replace('app.asar', 'app.asar.unpacked'); 


unhandled({
    logger: log.error,
    showDialog: false
});

var statusInterval = 0;
var shuttingDown = false;

const createWindow = async () => {
    if (!app.requestSingleInstanceLock()) {
        app.quit();    
    }

    if (!FLOONET) {
        global.ports = {
            node: 3413,
            foreign_rpc: 3415,
            owner: 3420,
            owner_rpc: 3421
        }
    } else {
        global.ports = {
            node: 13413,
            foreign_rpc: 13415,
            owner: 13420,
            owner_rpc: 13421
        }
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true
        },
        width: 1200,
        height: 800,
        title: "Grin++ v" + version,
        icon: __dirname + '/static/icons/GrinLogo.ico'
    });

    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    if (isDevMode) {
        //await installExtension(REACT_DEVELOPER_TOOLS);
        mainWindow.webContents.openDevTools();
    }

    if (LAUNCH_NODE) {
        const nodeFileName = (isWindows ? 'GrinNode.exe' : './GrinNode');

        log.info('Launching node: "' + binDirectory + nodeFileName + ' --headless"');
        ChildProcess.execFile(nodeFileName, ['--headless', FLOONET ? '--floonet' : ''], { cwd: binDirectory }, (error, stdout, stderr) => {
            if (global.update_in_progress === true) {
                autoUpdater.quitAndInstall();
            } else {
                if (error) {
                    log.error('Error thrown from within execFile: ', error);
                    dialog.showMessageBox({
                        message: "Error occurred in GrinNode process. Try restarting Grin++. Error: \n" + error,
                        buttons: ["OK"]
                    });
                } else {
                    log.info('Node shutdown normally. Calling app.quit().');
                    app.quit();
                }
            }
        });
    }

    setTimeout(function () {
        try {
            const config = Config.load();
            log.transports.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
            log.transports.file.level = config.level;
            log.transports.file.maxSize = 15 * 1024 * 1024;
            log.transports.file.file = config.data_path + '/LOGS/ui.log';
            log.transports.file.stream = fs.createWriteStream(log.transports.file.file, { flags: 'a' });
            log.transports.console.level = config.level;
        } catch(e) {

        }
        
        Client.start();
        FileListener.start();
        IPService.start();
    }, 1000);

    var processing_txhashset = false;

    global.mainWindow = mainWindow;

    mainWindow.webContents.on('did-finish-load', () => {
        if (!isDevMode) {
            Updater.checkForUpdates();
        }

        function getStatus(callback) {
            if (shuttingDown == true) {
                return null;
            } else {
                return Client.getStatus(callback);
            }
        }

        statusInterval = setInterval(getStatus, 1000, (status) => {
            if (mainWindow != null && shuttingDown == false) {
                if (status != null) {
                    //log.silly('NODE_STATUS: ' + JSON.stringify(status));
                    processing_txhashset = (status.sync_status == "PROCESSING_TXHASHSET");

                    mainWindow.webContents.send(
                        'NODE_STATUS',
                        status.sync_status,
                        status.network.num_inbound,
                        status.network.num_outbound,
                        status.header_height,
                        status.chain.height,
                        status.network.height,
                        status.state.downloaded,
                        status.state.download_size,
                        status.state.processing_status
                    );
                } else {
                    log.info('Failed to connect to node.');
                    mainWindow.webContents.send('NODE_STATUS', "Failed to Connect", 0, 0, 0, 0, 0, 0, 0, 0);
                }
            }
        });
    });


    mainWindow.on('close', (event) => {
        log.info("mainWindow.on('close')");
        if (processing_txhashset) {
            event.preventDefault();
            dialog.showMessageBox({
                message: "Can't close while validating downloaded state.",
                buttons: ["OK"]
            });
        } else {
            clearInterval(statusInterval);
            shuttingDown = true;
            log.info('Shutting down');

            if (LAUNCH_NODE) {
                Client.stop();

                setTimeout(function () {
                    log.warn('Node shutdown timed out.');

                    if (!isWindows) {
                        try {
                            ChildProcess.execFile('pkill', ['-f', 'GrinNode'], (err, stdout) => {
                                log.info("pkill executed");
                                app.quit();
                            });
                        } catch (e) {
                            log.info("pkill threw exception: " + e);
                            app.quit();
                        }
                    } else {
                        app.quit();
                    }
                }, 10000);
            } else {
                app.quit();
            }
        }
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
