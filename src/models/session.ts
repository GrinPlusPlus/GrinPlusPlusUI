import { Action, Computed, Thunk, action, computed, thunk } from "easy-peasy";

import { ISeed } from "../interfaces/ISeed";
import { Injections } from "../store";
import { StoreModel } from ".";

export interface SessionModel {
  username: string;
  token: string;
  address: string;
  setAddress: Action<SessionModel, string>;
  updateSession: Action<
    SessionModel,
    {
      username: string;
      token: string;
      address: string;
    }
  >;
  logout: Thunk<SessionModel, string, Injections, StoreModel>;
  isLoggedIn: Computed<SessionModel, boolean>;
  getWalletSeed: Thunk<
    SessionModel,
    {
      username: string;
      password: string;
    },
    Injections,
    StoreModel
  >;
  seed: ISeed[] | undefined;
  setSeed: Action<SessionModel, ISeed[] | undefined>;
  clean: Thunk<SessionModel, undefined, Injections, StoreModel>;
}

const session: SessionModel = {
  username: "",
  token: "",
  address: "",
  setAddress: action((state, payload) => {
    state.address = payload;
  }),
  updateSession: action((state, payload) => {
    state.username = payload.username;
    state.token = payload.token;
    state.address = payload.address;
  }),
  logout: thunk(
    async (actions, token, { injections, getStoreState, getStoreActions }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .logout(token)
        .then(response => {
          actions.clean();
        });
    }
  ),
  isLoggedIn: computed(state => {
    return state.username.length > 0 && state.token.length > 0;
  }),
  getWalletSeed: thunk(
    async (
      actions,
      payload,
      { injections, getStoreState }
    ): Promise<string[]> => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .getSeed(payload.username, payload.password)
        .then(response => {
          return response;
        });
    }
  ),
  seed: undefined,
  setSeed: action((state, seed) => {
    state.seed = seed;
  }),
  clean: thunk((actions, payload, { injections, getStoreActions }): void => {
    getStoreActions().ui.toggleSettings(false);
    getStoreActions().walletSummary.updateBalance(undefined);
    getStoreActions().walletSummary.updateSummary(undefined);
    getStoreActions().wallet.replaceLogs("");
    getStoreActions().finalizeModel.setResponseFile(undefined);
    getStoreActions().sendCoinsModel.setInitialValues();
    getStoreActions().createWallet.setInitialValues();
    getStoreActions().restoreWallet.setInitialValues();
    getStoreActions().ui.setAlert(undefined);
    actions.updateSession({ username: "", token: "", address: "" });
  })
};

export default session;
