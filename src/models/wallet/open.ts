import { Action, Thunk, action, thunk } from "easy-peasy";

import { Injections } from "../../store";
import { StoreModel } from "..";

export interface SigninModel {
  username: string;
  password: string;
  accounts: string[] | undefined;
  waitingResponse: boolean;
  setUsername: Action<SigninModel, string>;
  setPassword: Action<SigninModel, string>;
  setAccounts: Action<SigninModel, string[] | undefined>;
  setWaitingResponse: Action<SigninModel, boolean>;
  getAccounts: Thunk<SigninModel, undefined, Injections, StoreModel>;
  login: Thunk<
    SigninModel,
    {
      username: string;
      password: string;
    },
    Injections,
    StoreModel
  >;
}

const openWallet: SigninModel = {
  username: "",
  password: "",
  accounts: undefined,
  waitingResponse: false,
  setUsername: action((state, username) => {
    state.username = username;
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setAccounts: action((state, accounts) => {
    if (accounts === null) state.accounts = [];
    else state.accounts = accounts;
  }),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
  getAccounts: thunk(
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
        apiSettings.ip
      ).getAccounts();
    }
  ),
  login: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .login(payload.username, payload.password)
        .then((response) => {
          require("electron-log").info(
            "Login response: " + JSON.stringify(response)
          );
          getStoreActions().session.updateSession({
            username: payload.username,
            token: response.token,
            address: response.address,
            listener_port: response.listener_port,
            slatepack_address: response.slatepack_address,
          });
          actions.setUsername("");
          actions.setPassword("");
          return response;
        })
        .finally(() => {
          actions.setWaitingResponse(false);
        });
    }
  ),
};

export default openWallet;
