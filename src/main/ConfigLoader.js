const homedir = require('os').homedir();

function load() {
    let config = new Object();
    config.level = 'debug';
    config.data_path = homedir + '/.GrinPP/MAINNET';
    return config;
}

export default { load }