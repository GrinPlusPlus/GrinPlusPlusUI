const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
import Client from './client/Client';
const log = require("electron-log");


autoUpdater.on('error', (error) => {
    //dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
    log.info('update-available: Downloading update');
    autoUpdater.downloadUpdate();
})

autoUpdater.on('update-not-available', () => {

})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded: Prompting to install');
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version of Grin++ is available. Would you like to update now?',
        buttons: ['Yes', 'No']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            log.info('User chose to install');
            Client.stop(() => {
                log.info('Client stopped. Calling quitAndInstall');
                autoUpdater.quitAndInstall(true, true);
            });
        }
    });
});

function checkForUpdates () {
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;

    autoUpdater.checkForUpdates();
}

export default {checkForUpdates};