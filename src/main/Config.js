const homedir = require('os').homedir();
import { ipcMain } from 'electron';
import fs from 'fs';

var loaded = false;
var settings = null;
var configFileName = null;
var grinbox_enabled = false;
var tor_enabled = true;

function load() {
    let config = new Object();
    config.level = 'debug';

    const homedir = require('os').homedir();
    config.data_path = homedir + '/.GrinPP/MAINNET/';
    if (!fs.existsSync(config.data_path)) {
        fs.mkdirSync(config.data_path, { recursive: true })
    }

    configFileName = config.data_path + 'server_config.json';
    if (!fs.existsSync(configFileName)) {
        fs.writeFileSync(configFileName, '{}', 'utf-8');
    }

    settings = JSON.parse(fs.readFileSync(configFileName, 'utf-8'));

    if (settings.DATA_PATH != null) {
        config.data_path = settings.DATA_PATH;
    }

    grinbox_enabled = settings.WALLET != null && settings.WALLET.ENABLE_GRINBOX === true;
    tor_enabled = settings.TOR == null || settings.TOR.ENABLE_TOR !== false;

    if (!loaded) {
        loaded = true;

        ipcMain.on('Settings::Get', function (event) {
            event.returnValue = settings;
        });

        ipcMain.on('Settings::IsGrinboxEnabled', function (event) {
            event.returnValue = grinbox_enabled;
        });

        ipcMain.on('Settings::IsTorEnabled', function (event) {
            event.returnValue = tor_enabled;
        });

        ipcMain.on('Settings::Save', function (event, newSettings) {
            updateSettings(newSettings);
        });
    }

    if (!fs.existsSync(config.data_path + '/LOGS/')) {
        fs.mkdirSync(config.data_path + '/LOGS/', { recursive: true })
    }

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

function isGrinboxEnabled() {
    return grinbox_enabled;
}

export default { load, getSettings, updateSettings, isGrinboxEnabled }