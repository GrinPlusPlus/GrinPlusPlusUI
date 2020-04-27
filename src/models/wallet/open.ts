import {
  Action,
  action,
  Thunk,
  thunk
  } from 'easy-peasy';
import { Injections } from '../../store';
import { StoreModel } from '..';

export interface SigninModel {
  username: string;
  password: string;
  accounts: string[] | undefined;
  retryInterval: number;
  waitingResponse: boolean;
  setUsername: Action<SigninModel, string>;
  setPassword: Action<SigninModel, string>;
  setAccounts: Action<SigninModel, string[]>;
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
  retryInterval: 1000,
  waitingResponse: false,
  setUsername: action((state, username) => {
    state.username = username;
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setAccounts: action((state, accounts) => {
    if(accounts === null) state.accounts = [];
    else state.accounts = accounts.sort();
  }),
  setWaitingResponse: action((state, waiting) => {
    state.waitingResponse = waiting;
  }),
  getAccounts: thunk(
    async (actions, payload, { injections, getStoreState }) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      const accounts = await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      ).getAccounts();
      actions.setAccounts(accounts);
    }
  ),
  login: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      if (
        getStoreState().nodeSummary.status.toLocaleLowerCase() ===
        "not connected"
      ) {
        throw new Error("Wallet isn't Connected to the Node");
      }
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .login(payload.username, payload.password)
        .then((response) => {
          var base64Matcher = new RegExp(
            "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$"
          );
          if (!base64Matcher.test(response)) throw new Error(response);
          getStoreActions().session.updateSession({
            username: payload.username,
            token: response,
            address: "",
          });
          actions.setUsername("");
          actions.setPassword("");
          return true;
        });
    }
  ),
};

export default openWallet;
