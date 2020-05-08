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
import idiom, { IdiomModel } from "./idiom";
import { persist } from "easy-peasy";
import createElectronStorage from "redux-persist-electron-storage";

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
  idiom: IdiomModel;
}

const model = {
  settings: settings,
  ui: ui,
  signinModel: signinModel,
  createWallet: createWalletModel,
  restoreWallet: restoreWallet,
  session: session,
  nodeSummary: nodeSummary,
  walletSummary: walletSummary,
  sendCoinsModel: sendCoinsModel,
  receiveCoinsModel: receiveCoinsModel,
  finalizeModel: finalizeModel,
  wallet: wallet,
  idiom: persist(idiom, {
    storage: createElectronStorage(),
    mergeStrategy: "overwrite",
  }),
};

export default model;
