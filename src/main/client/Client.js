import { ipcMain } from 'electron';
import log from 'electron-log';

import SendToHTTP from './SendToHTTP';
import RequestSupport from './RequestSupport';
import Grinbox from '../Grinbox';
import Config from '../Config';
import IPService from '../IPService';
import RPCClient from './api/RPCClient';
import Strings from '../../Strings.js';

// Owner APIs
import CreateWallet from './api/owner/CreateWallet';
import RestoreWallet from './api/owner/RestoreWallet';
import UpdateWallet from './api/owner/UpdateWallet';
import Login from './api/owner/Login';
import Logout from './api/owner/Logout';
import WalletSummary from './api/owner/WalletSummary';
import Send from './api/owner/Send';
import EstimateFee from './api/owner/EstimateFee';
import Repost from './api/owner/Repost';
import Cancel from './api/owner/Cancel';
import TransactionInfo from './api/owner/TransactionInfo';
import GetOutputs from './api/owner/GetOutputs';
import GetAccounts from './api/owner/GetAccounts';

// Node APIs
import Shutdown from './api/node/Shutdown';
import GetConnectedPeers from './api/node/GetConnectedPeers';
import GetStatus from './api/node/GetStatus';
import ResyncBlockchain from './api/node/ResyncBlockchain';

const GRINJOIN_ADDRESS = "grinjoin5pzzisnne3naxx4w2knwxsyamqmzfnzywnzdk7ra766u7vid";

function StartOwnerClient() {
    function returnResult(name, result, error) {
        if (global.mainWindow != null) {
            if (error != null) {
                global.mainWindow.webContents.send(name + '::Response',
                    {
                        success: false,
                        error: error
                    }
                );
            } else if (result.error != null) {
                global.mainWindow.webContents.send(name + '::Response',
                    {
                        success: false,
                        error: result.error
                    }
                );

                if (result.error.data != null && result.error.data.type != null) {
                    global.mainWindow.webContents.send("Snackbar::Status", "ERROR", Strings.getErrorMsg(result.error.data.type));
                }
            } else {
                global.mainWindow.webContents.send(name + '::Response',
                    {
                        success: true,
                        data: result.data
                    }
                );
            }
        } else {
            log.error("global.mainWindow is null");
        }
    }

    ipcMain.on("ResyncBlockchain", function (event, fromGenesis) {
        ResyncBlockchain.call(event, fromGenesis);
    });

    ipcMain.on('CreateWallet', function (event, username, password) {
        CreateWallet.call(event, username, password);
    });

    ipcMain.on("RestoreFromSeed", function (event, username, password, walletWords) {
        RestoreWallet.call(event, username, password, walletWords);
    });

    ipcMain.on("UpdateWallet", function (event, fromGenesis) {
        UpdateWallet.call(event, fromGenesis);
    });

    ipcMain.on('Login', function (event, username, password) {
        Login.call(event, username, password, function (secretKey, address) {
            IPService.connect();

            if (Config.isGrinboxEnabled()) {
                console.log(secretKey);
                Grinbox.subscribe(secretKey, address);
            }
        });
    });

    ipcMain.on('Logout', function (event) {
        Logout.call(event);
        IPService.disconnect();
        Grinbox.unsubscribe();
    });

    ipcMain.on("WalletSummary", function (event) {
        WalletSummary.call(event);
    });

    ipcMain.on('TOR::Send', function (event, address, amount, strategy, inputs, message, grinjoin) {
        var reqJSON = new Object();
        reqJSON['session_token'] = global.session_token;
        reqJSON['amount'] = amount;
        reqJSON['fee_base'] = 1000000;
        reqJSON['selection_strategy'] = {
            strategy: strategy,
            inputs: inputs
        };

        reqJSON['address'] = address;

        if (message != null && message.length > 0) {
            reqJSON['message'] = message;
        }

        var postJSON = new Object();
        if (grinjoin == true) {
            postJSON['method'] = 'JOIN';
            postJSON['grinjoin_address'] = GRINJOIN_ADDRESS;
        } else {
            postJSON['method'] = 'STEM';
        }
        reqJSON["post_tx"] = postJSON;

        RPCClient.call('send', reqJSON, function (result, error) {
            returnResult('TOR::Send', result, error);
        });
    });

    ipcMain.on('File::Send', function (event, amount, strategy, inputs, file, message) {
        var reqJSON = new Object();
        reqJSON['session_token'] = global.session_token;
        reqJSON['amount'] = amount;
        reqJSON['fee_base'] = 1000000;
        reqJSON['selection_strategy'] = {
            strategy: strategy,
            inputs: inputs
        };

        reqJSON['file'] = file;

        if (message != null && message.length > 0) {
            reqJSON['message'] = message;
        }

        RPCClient.call('send', reqJSON, function (result, error) {
            returnResult('File::Send', result, error);
        });
    });

    ipcMain.on('ReceiveFile', function (event, slate, file, message) {
        var reqJSON = new Object();
        reqJSON['session_token'] = global.session_token;
        reqJSON['slate'] = slate;
        reqJSON['file'] = file;

        if (message != null && message.length > 0) {
            reqJSON['message'] = message;
        }

        RPCClient.call('receive', reqJSON, function (result, error) {
            returnResult('ReceiveFile', result, error);
        });
    });

    ipcMain.on('File::Finalize', function (event, slate, file, grinjoin) {
        var reqJSON = new Object();
        reqJSON['session_token'] = global.session_token;
        reqJSON['slate'] = slate;
        reqJSON['file'] = file;

        var postJSON = new Object();
        if (grinjoin == true) {
            postJSON['method'] = 'JOIN';
            postJSON['grinjoin_address'] = GRINJOIN_ADDRESS;
        } else {
            postJSON['method'] = 'STEM';
        }
        reqJSON["post_tx"] = postJSON;

        RPCClient.call('finalize', reqJSON, function (result, error) {
            returnResult('File::Finalize', result, error);
        });
    });

    ipcMain.on("EstimateFee", function (event, amount, strategy, inputs) {
        EstimateFee.call(amount, strategy, inputs, function (result) {
            event.returnValue = result;
        });
    });

    ipcMain.on("Repost", function (event, walletTxId) {
        Repost.call(event, walletTxId);
    });

    ipcMain.on("Cancel", function (event, walletTxId) {
        Cancel.call(event, walletTxId);
    });

    ipcMain.on("TransactionInfo::Get", function (event, walletTxId) {
        TransactionInfo.call(event, walletTxId);
    });

    ipcMain.on("GetOutputs", function (event, showSpent, showCanceled) {
        GetOutputs.call(event, showSpent, showCanceled);
    });

    ipcMain.on("GetAccounts", function (event) {
        console.log("Calling GetAccounts.call");
        GetAccounts.call(event);
    });
}

function start() {
    log.info("Starting Grin++ Client");

    if (Config.isGrinboxEnabled()) {
        Grinbox.init();
    }

    StartOwnerClient();

    ipcMain.on("GetConnectedPeers", function (event) {
        GetConnectedPeers.call(event);
    });

    ipcMain.on('HTTP::Send', function (event, httpAddress, amount, strategy, inputs, message, grinjoin) {
        SendToHTTP.call(httpAddress, amount, strategy, inputs, message, grinjoin, function (result) {
            if (result.success) {
                global.mainWindow.webContents.send('HTTP::Send::Response',
                    {
                        success: true,
                        data: result.data
                    }
                );
            } else {
                global.mainWindow.webContents.send("Snackbar::Status", "ERROR", "Failed to send");
                global.mainWindow.webContents.send('HTTP::Send::Response',
                    {
                        success: false,
                        data: result.error
                    }
                );
            }
        });
    });

    ipcMain.on('Support::SubmitRequest', function (event, name, email, description) {
        RequestSupport.call(event, name, email, description);
    });

    ipcMain.on('Grinbox::Send', function (event, grinboxAddress, amount, strategy, inputs, message) {
        // TODO: Validate GrinboxAddress first
        Send.call(amount, strategy, inputs, grinboxAddress, message, false, function (result) {
            if (result.success === true) {
                Grinbox.sendSlate(result.slate, grinboxAddress);
                event.returnValue = "SENT"; // TODO: Wait for "ok" message?
            } else {
                log.error("Send failed with error: " + result.message);
                event.returnValue = result;
            }
        });
    });

    ipcMain.on('Grinbox::GetAddress', function (event) {
        event.returnValue = Grinbox.getAddress();
    });

    ipcMain.on('Snackbar::Relay', function (event, status, message) {
        if (global.mainWindow != null) {
            global.mainWindow.webContents.send("Snackbar::Status", status, message);
        }
    })

    ipcMain.on('Tor::GetAddress', function (event) {
        event.returnValue = global.tor_address;
    });
}

function stop() {
    Grinbox.shutdown();
    Shutdown.call();
}

function getStatus(callback) {
    GetStatus.call(callback);
}

export default {start, stop, getStatus}