const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
import Client from './client/Client';
const log = require("electron-log");


autoUpdater.on('error', (error) => {
    //dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
    autoUpdater.downloadUpdate();
})

autoUpdater.on('update-not-available', () => {

})

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version of Grin++ is available. Would you like to update now?',
        buttons: ['Yes', 'No']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            global.update_in_progress = true;
            Client.stop();
        }
    });
});

function checkForUpdates () {
    autoUpdater.logger = log;

    autoUpdater.checkForUpdates();
}

export default {checkForUpdates};