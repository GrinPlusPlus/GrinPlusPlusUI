
function sendSuccess(message) {
    if (global.mainWindow != null) {
        global.mainWindow.webContents.send("Snackbar::Status", "SUCCESS", message);
    }
}

function sendError(message) {
    if (global.mainWindow != null) {
        global.mainWindow.webContents.send("Snackbar::Status", "ERROR", message);
    }
}

export default { sendSuccess, sendError }