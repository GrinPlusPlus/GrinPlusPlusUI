import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk
  } from 'easy-peasy';
import { Injections } from '../store';
import { StoreModel } from '.';

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
      await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .logout(token)
        .then((response) => {
          actions.updateSession({ username: "", token: "", address: "" });
          getStoreActions().wallet.replaceLogs("");
          getStoreActions().finalizeModel.setResponseFile(undefined);
          getStoreActions().sendCoinsModel.setInitialValues();
        });
    }
  ),
  isLoggedIn: computed((state) => {
    return state.username?.length > 0 && state.token?.length > 0;
  }),
};

export default session;
