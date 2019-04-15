import { app, BrowserWindow, ipcMain, net } from 'electron';
import ChildProcess from 'child_process';
import Client from './main/client/Client';
import Server from './main/server/Server';
import FileListener from './main/FileListener';
import IPService from './main/IPService';
import GrinboxConnection from './main/Grinbox/GrinboxConnection';

//import { enableLiveReload } from 'electron-compile';
//import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

//if (isDevMode) {
//    enableLiveReload({ strategy: 'react-hmr' });
//}

var statusInterval = 0;

const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: __dirname + '/static/icons/GrinLogo.ico'
    });

    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);

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
    
    var binDirectory = `${__dirname}/bin/`;//`${__dirname}/resources/app/src/bin/`;
    //if (isDevMode) {
    //    binDirectory = `${__dirname}/bin/`;
    //}
    console.log(binDirectory);

    ChildProcess.execFile('GrinNode.exe', ['--headless'], { cwd: binDirectory }, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }

        app.quit();
    });

    Client.start();
    Server.start();
    FileListener.start();
    IPService.start();
    GrinboxConnection.connect(mainWindow);

    mainWindow.webContents.on('did-finish-load', () => {
        statusInterval = setInterval(Client.getStatus, 2000, (status) => {
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
        Client.stop();

        setTimeout(function () {
            app.quit();
        }, 5000);
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
