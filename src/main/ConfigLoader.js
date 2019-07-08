const homedir = require('os').homedir();
import { ipcMain } from 'electron';
import fs from 'fs';

var settings = null;
var configFileName = null;

function load() {
    let config = new Object();
    config.level = 'debug';
    config.data_path = homedir + '/.GrinPP/MAINNET';
    configFileName = config.data_path + '/server_config.json';

    settings = JSON.parse(fs.readFileSync(configFileName, 'utf-8'));

    ipcMain.on('Settings::Get', function (event) {
        event.returnValue = settings;
    });

    ipcMain.on('Settings::Save', function (event, newSettings) {
        updateSettings(newSettings);
    });

    return config;
}

function getSettings() {
    return settings;
}

function updateSettings(newSettings) {
    settings = newSettings;
    fs.writeFile(configFileName, JSON.stringify(newSettings, null, 4), 'utf8', (err) => {
        if (err) {
            throw err;
        }
    });
}

export default { load, getSettings, updateSettings }