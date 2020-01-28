function FormatAmount(amount) {
    var calculatedAmount = Math.abs(amount) / Math.pow(10, 9);
    var formatted = calculatedAmount.toFixed(9) + "ツ";
    if (amount < 0) {
        formatted = "-" + formatted;
    }

    return formatted;
}

function FormatDateTime(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return date.toLocaleDateString();
    } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            intervalType = "hour";
        } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                intervalType = "minute";
            } else {
                interval = seconds;
                intervalType = "second";
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval + ' ' + intervalType + ' ago';
}

export default { FormatAmount, FormatDateTime }