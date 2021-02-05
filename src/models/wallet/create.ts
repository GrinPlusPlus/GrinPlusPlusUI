import { Action, Computed, Thunk, action, computed, thunk } from "easy-peasy";

import { ISeed } from "../../interfaces/ISeed";
import { Injections } from "../../store";
import { StoreModel } from "..";
import update from "immutability-helper";

export interface CreateWalletModel {
  username: string;
  password: string;
  passwordConfirmation: string;
  minPasswordLength: number;
  generatedSeed: { position: number; text: string; disabled: boolean }[];
  setInitialValues: Action<CreateWalletModel>;
  setUsername: Action<CreateWalletModel, string>;
  setPassword: Action<CreateWalletModel, string>;
  setPasswordConfirmation: Action<CreateWalletModel, string>;
  setGeneratedSeed: Action<CreateWalletModel, string[]>;
  seedLength: string;
  setSeedLength: Action<CreateWalletModel, string>;
  create: Thunk<
    CreateWalletModel,
    {
      username: string;
      password: string;
      seedLength: string;
    },
    Injections,
    StoreModel
  >;
  hiddenSeed: ISeed[];
  setHiddenSeed: Action<CreateWalletModel, ISeed[]>;
  setHiddenSeedWord: Thunk<
    CreateWalletModel,
    {
      word: string;
      position: number;
    },
    Injections,
    StoreModel
  >;
  disableHiddenSeedWord: Action<CreateWalletModel, number>;
  seedsMatched: Computed<CreateWalletModel, boolean>;
}

const createWalletModel: CreateWalletModel = {
  username: "",
  password: "",
  passwordConfirmation: "",
  minPasswordLength: 8,
  generatedSeed: [],
  seedLength: "24",
  setUsername: action((state, username) => {
    if (username.length === 0) state.username = "";
    else if (username.match(/^[a-z0-9]+$/i)) {
      state.username = username;
    }
  }),
  setInitialValues: action((state) => {
    state.username = "";
    state.password = "";
    state.passwordConfirmation = "";
    state.generatedSeed = [];
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setPasswordConfirmation: action((state, password) => {
    state.passwordConfirmation = password;
  }),
  setSeedLength: action((state, length) => {
    state.seedLength = length;
  }),
  setGeneratedSeed: action((state, seed) => {
    let position: number = 1;
    const newSeed: ISeed[] = seed.map(function (word: string) {
      return {
        position: position++,
        text: word,
        disabled: true,
        valid: true,
      };
    });
    state.generatedSeed = newSeed;
  }),
  create: thunk(
    async (
      actions,
      payload,
      { injections, getStoreActions, getStoreState }
    ) => {
      const { ownerService } = injections;
      const apiSettings = getStoreState().settings.defaultSettings;
      await new ownerService.RPC(
        apiSettings.floonet,
        apiSettings.protocol,
        apiSettings.ip
      )
        .createWallet(payload.username, payload.password, payload.seedLength)
        .then((wallet) => {
          actions.setGeneratedSeed(wallet.seed);
          actions.setPassword("");
          actions.setPasswordConfirmation("");
          actions.setUsername("");
          getStoreActions().session.updateSession({
            username: wallet.username,
            token: wallet.token,
            address: wallet.address,
            listener_port: wallet.listener_port,
            slatepack_address: wallet.slatepack_address,
          });

          return wallet.token;
        });
    }
  ),
  hiddenSeed: [],
  setHiddenSeed: action((state, seed) => {
    state.hiddenSeed = update(state.hiddenSeed, { $set: seed });
  }),
  disableHiddenSeedWord: action((state, index) => {
    state.hiddenSeed[index].disabled = true;
  }),
  setHiddenSeedWord: thunk(
    (actions, payload, { injections, getStoreState }) => {
      const index = payload.position - 1;
      const word = { ...getStoreState().createWallet.hiddenSeed[index] };
      word.text = payload.word;
      // word.valid = isValidSeedWord(payload.word);
      if (
        getStoreState().createWallet.generatedSeed[index].text === word.text
      ) {
        word.disabled = true;
      }
      const newSeed: ISeed[] = [];
      [...getStoreState().createWallet.hiddenSeed].forEach((element) => {
        let item = element;
        if (element.position === word.position) {
          item = word;
        }
        newSeed.push(item);
      });
      actions.setHiddenSeed(newSeed);
    }
  ),
  seedsMatched: computed((state) => {
    if (state.hiddenSeed.length === 0) return true;
    let disabledWords: number = 0;
    state.hiddenSeed.forEach((word: any) => {
      if (word.disabled === true) disabledWords++;
    });
    return disabledWords === state.hiddenSeed.length;
  }),
};

export default createWalletModel;
