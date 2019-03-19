import { ipcMain } from 'electron';
import CreateWallet from './api/CreateWallet';
import RestoreWallet from './api/RestoreWallet';
import UpdateWallet from './api/UpdateWallet';
import Login from './api/Login';
import Logout from './api/Logout';
import WalletSummary from './api/WalletSummary';
import RetrieveTransactions from './api/RetrieveTransactions';
import Send from './api/Send';
import Receive from './api/Receive';
import Finalize from './api/Finalize';
import Cancel from './api/Cancel';
import Shutdown from './api/Shutdown';

exports.start = function() {
  console.log("STARTING WALLET CLIENT");

  ipcMain.on('CreateWallet', function(event, username, password) {
    CreateWallet.call(event, username, password);
  });

  ipcMain.on("RestoreFromSeed", function(event, username, password, walletWords) {
    RestoreWallet.call(event, username, password, walletWords);
  });

  ipcMain.on("UpdateWallet", function(event) {
    UpdateWallet.call(event);
  });

  ipcMain.on('Login', function(event, username, password) {
    Login.call(event, username, password);
  });

  ipcMain.on('Logout', function(event) {
    Logout.call(event);
  });

  ipcMain.on("WalletSummary", function(event) {
    WalletSummary.call(event);
  });

  ipcMain.on("RetrieveTransactions", function(event) {
    RetrieveTransactions.call(event);
  });

  ipcMain.on("Send", function(event, amount) {
    Send.call(event, amount);
  });

  ipcMain.on("Receive", function(event, slate) {
    Receive.call(event, slate);
  });

  ipcMain.on("Finalize", function(event, slate) {
    Finalize.call(event, slate);
  });

  ipcMain.on("Cancel", function(event, walletTxId) {
    Cancel.call(event, walletTxId);
  });
}

exports.stop = function() {
  Shutdown.call();
}
