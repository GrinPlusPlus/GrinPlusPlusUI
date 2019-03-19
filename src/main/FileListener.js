import { ipcMain, dialog, app } from 'electron';
import fs from 'fs';

exports.start = function() {
  const defaultPath = app.getPath('desktop');

  ipcMain.on("SaveToFile", function(event, fileName, value) {
    fs.writeFile(fileName, value, 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('Slate saved to: ' + fileName);
    });
  });

  ipcMain.on("SendFile", function(event) {
    dialog.showSaveDialog(
      {
        defaultPath: defaultPath,
        filters: [
          {name: 'Tx Files', extensions: ['tx']},
          {name: 'All Files', extensions: ['*']}
        ]
      },
      function (fileName) {
        if (fileName !== undefined) {
          event.sender.send('DestinationSelected', fileName);
        }
      }
    );
  });

  ipcMain.on("ReceiveFile", function(event) {
    dialog.showOpenDialog(
      {
        defaultPath: defaultPath,
        properties: ['openFile'],
        filters: [
          {name: 'Tx Files', extensions: ['tx', 'response']},
          {name: 'All Files', extensions: ['*']}
        ]
      },
      function (filePaths) {
        if (filePaths !== undefined) {
          var fileName = filePaths[0];
          fs.readFile(fileName, 'utf-8', function (err, data) {
            event.sender.send('SlateReceived', fileName, data);
          });
        }
      }
    );
  });
}
