import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk
  } from 'easy-peasy';
import { generateEmptySeed, getSeedWords } from '../../helpers';
import { Injections } from '../../store';
import { ISeed } from '../../interfaces/ISeed';
import { StoreModel } from '..';

export interface RestoreWalletModel {
  username: string;
  password: string;
  seed: {
    position: number;
    text: string;
    disabled: boolean;
  }[];
  seedLength: string;
  setUsername: Action<RestoreWalletModel, string>;
  setPassword: Action<RestoreWalletModel, string>;
  setSeedLength: Action<RestoreWalletModel, string>;
  setSeedWord: Action<RestoreWalletModel, { word: string; position: number }>;
  restore: Thunk<
    RestoreWalletModel,
    {
      username: string;
      password: string;
      seed: ISeed[];
    },
    Injections,
    StoreModel
  >;
  isSeedCompleted: Computed<RestoreWalletModel, boolean>;
}

const restoreWallet: RestoreWalletModel = {
  username: "",
  password: "",
  seed: generateEmptySeed(),
  seedLength: "24",
  setUsername: action((state, payload) => {
    state.username = payload;
  }),
  setPassword: action((state, payload) => {
    state.password = payload;
  }),
  setSeedWord: action((state, payload) => {
    state.seed[payload.position].text = payload.word;
  }),
  setSeedLength: action((state, length) => {
    state.seedLength = length.toString();
  }),
  restore: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      return await new ownerService.REST(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip,
        apiSettings.mode
      )
        .restoreWallet(
          payload.username,
          payload.password,
          getSeedWords(payload.seed)
        )
        .then((response) => {
          if (typeof response === "string") {
            throw new Error(response);
          }
          getStoreActions().session.updateSession({
            username: response.username,
            token: response.token,
            address: "",
          });
        });
    }
  ),
  isSeedCompleted: computed((state) => {
    let filled: number = 0;
    state.seed.forEach((word) => {
      if (word.text.length) filled++;
    });
    return filled === state.seed.length;
  }),
};

export default restoreWallet;
