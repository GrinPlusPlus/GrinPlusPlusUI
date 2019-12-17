import { ipcMain, dialog, app } from 'electron';
import fs from 'fs';
import log from 'electron-log';

function start() {
    const defaultPath = app.getPath('desktop');

    ipcMain.on("SaveToFile", function (event, fileName, value) {
        log.debug('Saving slate to ' + fileName);

        fs.writeFileSync(fileName, value, 'utf8');
        log.info('Slate successfully saved to ' + fileName);
    });

    ipcMain.on('ChooseDestination', function (event) {
        dialog.showSaveDialog(
            {
                defaultPath: defaultPath,
                filters: [
                    { name: 'Tx Files', extensions: ['tx'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            },
            function (fileName) {
                if (fileName !== undefined) {
                    event.sender.send('DestinationSelected', fileName);
                }
            }
        );
    });

    ipcMain.on("ChooseInputFile", function (event) {
        dialog.showOpenDialog(
            {
                defaultPath: defaultPath,
                properties: ['openFile'],
                filters: [
                    { name: 'Tx Files', extensions: ['tx', 'json', 'response'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            },
            function (filePaths) {
                if (filePaths !== undefined) {
                    event.sender.send('ReceiveFileSelected', filePaths[0]);
                    //var fileName = filePaths[0];
                    //fs.readFile(fileName, 'utf-8', function (err, data) {
                    //    event.sender.send('SlateReceived', fileName, data);
                    //});
                }
            }
        );
    });

    ipcMain.on("OpenSlateFile", function (event, fileName) {
        fs.readFile(fileName, 'utf-8', function (err, data) {
            event.sender.send('SlateOpened', fileName, data);
        });
    });
}

export default {start}