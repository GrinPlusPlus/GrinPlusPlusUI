import createWalletModel, { CreateWalletModel } from "./wallet/create";
import finalizeModel, { FinalizeModel } from "./coins/finalize";
import nodeSummary, { NodeSummaryModel } from "./node";
import receiveCoinsModel, { ReceiveCoinsModel } from "./coins/receive";
import restoreWallet, { RestoreWalletModel } from "./wallet/restore";
import sendCoinsModel, { SendCoinsModel } from "./coins/send";
import session, { SessionModel } from "./session";
import settings, { SettingsModel } from "./settings";
import signinModel, { SigninModel } from "./wallet/open";
import ui, { UIModel } from "./ui";
import wallet, { WalletModel } from "./wallet";
import walletSummary, { WalletSummaryModel } from "./wallet/summary";
import { persist } from "easy-peasy";

export interface StoreModel {
  settings: SettingsModel;
  ui: UIModel;
  signinModel: SigninModel;
  createWallet: CreateWalletModel;
  restoreWallet: RestoreWalletModel;
  session: SessionModel;
  nodeSummary: NodeSummaryModel;
  walletSummary: WalletSummaryModel;
  sendCoinsModel: SendCoinsModel;
  receiveCoinsModel: ReceiveCoinsModel;
  finalizeModel: FinalizeModel;
  wallet: WalletModel;
}

const model = {
  settings: settings,
  ui: ui,
  signinModel: signinModel,
  createWallet: createWalletModel,
  restoreWallet: restoreWallet,
  session: persist(session),
  nodeSummary: persist(nodeSummary),
  walletSummary: persist(walletSummary),
  sendCoinsModel: sendCoinsModel,
  receiveCoinsModel: receiveCoinsModel,
  finalizeModel: finalizeModel,
  wallet: persist(wallet),
};

export default model;
