
function FormatAmount(amount) {
    var calculatedAmount = Math.abs(amount) / Math.pow(10, 9);
    var formatted = calculatedAmount.toFixed(9) + "ツ";
    if (amount < 0) {
        formatted = "-" + formatted;
    }

    return formatted;
}

export default {FormatAmount}