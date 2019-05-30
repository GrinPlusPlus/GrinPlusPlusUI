const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const logger = require("electron-log");


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
            autoUpdater.quitAndInstall();
        }
    });
});

function checkForUpdates () {
    logger.transports.file.level = "debug";
    autoUpdater.logger = logger;

    autoUpdater.checkForUpdates();
}

export default {checkForUpdates};