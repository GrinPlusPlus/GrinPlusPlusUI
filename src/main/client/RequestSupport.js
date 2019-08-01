import ConfigLoader from '../ConfigLoader';
import log from 'electron-log';
const fs = require('fs');
const archiver = require('archiver');
const os = require('os');
const FormData = require('form-data');
import { version } from '../../../package.json';

function upload(filename) {

    const formData = new FormData();

    formData.append('report_file', fs.createReadStream(filename));

    formData.submit("https://api.grinplusplus.com/bugreport/bugreport.php", function (err, res) {
        if (err != null) {
            log.warn("Error occurred uploading bug report: " + JSON.stringify(err));
        }

        res.resume();

        let result = new Object();
        result.success = (err == null);
        if (global.mainWindow != null) {
            global.mainWindow.webContents.send("Support::RequestSubmitted", result);
        }
    });
}

async function archiveLogs(name, email, description) {
    const filename = __dirname + '/' + name + '_' + Date.now().toString() + '.zip';
    // create a file to stream archive data to.
    var output = fs.createWriteStream(filename);
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        log.info(archive.pointer() + ' total bytes');
        log.info('archiver has been finalized and the output file descriptor has closed.');
        upload(filename);
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
        log.info('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var userInfo = new Object();
    userInfo.name = name;
    userInfo.email = email;
    userInfo.description = description;
    userInfo.version = version;
    userInfo.dateTime = dateTime;
    userInfo.os = new Object();
    userInfo.os.platform = os.platform();
    userInfo.os.release = os.release();
    userInfo.os.arch = os.arch();
    userInfo.os.cpus = os.cpus();
    userInfo.os.totalmem = os.totalmem();

    archive.append(JSON.stringify(userInfo), { name: 'UserInfo.txt' });

    // append files from a sub-directory, putting its contents at the root of archive
    const logs_path = ConfigLoader.load().data_path + '/NODE/LOGS/';
    log.info("LOGS_PATH: " + logs_path);
    archive.directory(logs_path, false);

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
}

async function call(event, name, email, description) {
    log.info("Submitting support request");
    archiveLogs(name, email, description);
    /*const request = await ConnectionUtils.buildForeignRequest(GRINPP_URL, ForeignReceive.SUPPORT_PATH);
    if (request == null) {
        log.error("Failed to connect to bugreport service");
        event.returnValue = 'CantConnect';
        return;
    }
    
    request.on('response', (response) => {
        result["status_code"] = response.statusCode;

        var responseBody = "";
        response.on('data', (chunk) => {
            responseBody += chunk;
        });

        response.on('end', () => {
            result["body"] = responseBody;
            log.info("Bug report response: " + JSON.stringify(result));
            callback(result);
        });
    });
    request.on('error', (error) => {
        log.error("Error occurred when submitting bug report: " + error.message);
        result['raw_error'] = error.message;
        callback(result);
    });

    var requestBody = new object();
    requestBody.name = name;
    requestBody.email = email;
    requestBody.description = description;
    // TODO: Logs
    request.write(JSON.stringify(requestBody));
    request.end();*/

};

export default {call}