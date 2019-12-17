import { ipcRenderer } from 'electron';

function Success(msg) {
    ipcRenderer.send('Snackbar::Relay', "SUCCESS", msg);
}

function Error(msg) {
    ipcRenderer.send('Snackbar::Relay', "ERROR", msg);
}

export default { Success, Error }