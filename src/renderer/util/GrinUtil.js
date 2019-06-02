var compressjs = require('compressjs');
var bzip = compressjs.Bzip2;

function FormatAmount(amount) {
    var calculatedAmount = Math.abs(amount) / Math.pow(10, 9);
    var formatted = calculatedAmount.toFixed(9) + "ツ";
    if (amount < 0) {
        formatted = "-" + formatted;
    }

    return formatted;
}

function Compress(string) {
    var data = new Buffer(string, 'utf8');
    return (new Buffer(bzip.compressFile(data))).toString('base64');
}

function Decompress(string64) {
    const decompressed = bzip.decompressFile(new Buffer(string64, 'base64'));
    return (new Buffer(decompressed)).toString('utf8')
}

export default {FormatAmount, Compress, Decompress}