import { Action, Computed, Thunk, action, computed, thunk } from "easy-peasy";

import { ISeed } from "../interfaces/ISeed";
import { Injections } from "../store";
import { StoreModel } from ".";

export interface SessionModel {
  username: string;
  token: string;
  address: string;
  setAddress: Action<SessionModel, string>;
  slatepackAddress: string;
  listenerPort: number;
  encodedAddress: string;
  displayQRCode: boolean;
  updateSession: Action<
    SessionModel,
    {
      username: string;
      token: string;
      address: string;
      listener_port: number;
      slatepack_address: string;
    }
  >;
  logout: Thunk<SessionModel, string, Injections, StoreModel>;
  isLoggedIn: Computed<SessionModel, boolean>;
  seed: ISeed[] | undefined;
  setSeed: Action<SessionModel, ISeed[] | undefined>;
  clean: Thunk<SessionModel, undefined, Injections, StoreModel>;
  setEncodedAddress: Action<SessionModel, string>;
  setDisplayQRCode: Action<SessionModel, boolean>;
}

const session: SessionModel = {
  username: "",
  token: "",
  address: "",
  listenerPort: 0,
  slatepackAddress: "",
  encodedAddress: "",
  displayQRCode: false,
  setAddress: action((state, payload) => {
    state.address = payload;
  }),
  updateSession: action((state, payload) => {
    state.username = payload.username;
    state.token = payload.token;
    state.address = payload.address;
    state.listenerPort = payload.listener_port;
    state.slatepackAddress = payload.slatepack_address;
  }),
  logout: thunk(
    async (actions, token, { injections, getStoreState, getStoreActions }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .logout(token)
        .then((response) => {
          actions.clean();
        });
    }
  ),
  isLoggedIn: computed((state) => {
    return state.username.length > 0 && state.token.length > 0;
  }),
  seed: undefined,
  setSeed: action((state, seed) => {
    state.seed = seed;
  }),
  clean: thunk((actions, payload, { injections, getStoreActions }): void => {
    getStoreActions().ui.toggleSettings(false);
    getStoreActions().walletSummary.updateBalance(undefined);
    getStoreActions().walletSummary.updateSummary(undefined);
    getStoreActions().walletSummary.clearWalletReachable(undefined);
    getStoreActions().walletSummary.setSelectedTx(-1);
    getStoreActions().wallet.setAction(undefined);
    getStoreActions().wallet.replaceLogs("");
    getStoreActions().sendCoinsModel.setInitialValues();
    getStoreActions().createWallet.setInitialValues();
    getStoreActions().restoreWallet.setInitialValues();
    getStoreActions().signinModel.setAccounts(undefined);
    getStoreActions().ui.setAlert(undefined);
    actions.updateSession({
      username: "",
      token: "",
      address: "",
      listener_port: 0,
      slatepack_address: "",
    });
  }),
  setDisplayQRCode: action((state, payload) => {
    state.displayQRCode = payload;
  }),
  setEncodedAddress: action((state, payload) => {
    state.encodedAddress = payload;
  }),
};

export default session;
