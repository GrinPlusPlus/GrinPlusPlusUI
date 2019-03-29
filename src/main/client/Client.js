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
import Repost from './api/Repost';
import Cancel from './api/Cancel';
import Shutdown from './api/Shutdown';
import GetConnectedPeers from './api/GetConnectedPeers';

const ownerPort = 3420; // todo: floonet = 13420
const nodePort = 3413; // todo: floonet = 13413

exports.start = function() {
  console.log("STARTING WALLET CLIENT");

  ipcMain.on('CreateWallet', function(event, username, password) {
    CreateWallet.call(event, ownerPort, username, password);
  });

  ipcMain.on("RestoreFromSeed", function(event, username, password, walletWords) {
    RestoreWallet.call(event, ownerPort, username, password, walletWords);
  });

  ipcMain.on("UpdateWallet", function(event) {
    UpdateWallet.call(event, ownerPort);
  });

  ipcMain.on('Login', function(event, username, password) {
    Login.call(event, ownerPort, username, password);
  });

  ipcMain.on('Logout', function(event) {
    Logout.call(event, ownerPort);
  });

  ipcMain.on("WalletSummary", function(event) {
    WalletSummary.call(event, ownerPort);
  });

  ipcMain.on("RetrieveTransactions", function(event) {
    RetrieveTransactions.call(event, ownerPort);
  });

  ipcMain.on("Send", function(event, amount) {
    Send.call(event, ownerPort, amount);
  });

  ipcMain.on("Receive", function(event, slate) {
    Receive.call(event, ownerPort, slate);
  });

  ipcMain.on("Finalize", function(event, slate) {
    Finalize.call(event, ownerPort, slate);
  });

  ipcMain.on("Repost", function(event, walletTxId) {
    Repost.call(event, ownerPort, walletTxId);
  });

  ipcMain.on("Cancel", function(event, walletTxId) {
    Cancel.call(event, ownerPort, walletTxId);
  });

  ipcMain.on("GetNodeStats", function(event) {

  });

  ipcMain.on("GetConnectedPeers", function(event) {
    GetConnectedPeers.call(event, nodePort);
  })
}

exports.stop = function() {
  Shutdown.call(nodePort);
}
