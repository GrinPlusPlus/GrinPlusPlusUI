import { app, BrowserWindow } from 'electron';
import ChildProcess from 'child_process';
import Client from './main/client/Client';
import Server from './main/server/Server';
import FileListener from './main/FileListener';
import IPService from './main/IPService';
import GrinboxConnection from './main/Grinbox/GrinboxConnection';
import Updater from './main/Updater.js';
import {version} from '../package.json';

const isDevMode = process.execPath.match(/[\\/]electron/);
const LAUNCH_NODE = !isDevMode || false;

//import { enableLiveReload } from 'electron-compile';
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

if (isDevMode) {
    //enableLiveReload({ strategy: 'react-hmr' });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var statusInterval = 0;
var shuttingDown = false;

const createWindow = async () => {
    if (!app.requestSingleInstanceLock()) {
        app.quit();    
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
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

    // Emitted when the window is closed.
    //mainWindow.on('closed', () => {
    //    clearInterval(statusInterval);
    //    // Dereference the window object, usually you would store windows
    //    // in an array if your app supports multi windows, this is the time
    //    // when you should delete the corresponding element.
    //    mainWindow = null;
    //});
    
    var binDirectory = `${__dirname}/bin/`;
    console.log(binDirectory);

    if (LAUNCH_NODE) {
        ChildProcess.execFile('GrinNode.exe', ['--headless'], { cwd: binDirectory }, (error, stdout, stderr) => {
            if (error) {
                throw error;
            }

            app.quit();
        });
    }

    Client.start();
    Server.start();
    FileListener.start();
    IPService.start();
    GrinboxConnection.connect(mainWindow);

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

        statusInterval = setInterval(getStatus, 2000, (status) => {
            if (mainWindow != null) {
                if (status != null) {
                    mainWindow.webContents.send('NODE_STATUS', status.sync_status, status.network.num_inbound, status.network.num_outbound, status.header_height, status.chain.height, status.network.height);
                } else {
                    mainWindow.webContents.send('NODE_STATUS', "Failed to Connect", 0, 0, 0, 0, 0);
                }
            }
        });
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        clearInterval(statusInterval);
        shuttingDown = true;

        if (LAUNCH_NODE) {
            Client.stop();

            setTimeout(function () {
                app.quit();
            }, 5000);
        } else {
            app.quit();
        }
    }
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
