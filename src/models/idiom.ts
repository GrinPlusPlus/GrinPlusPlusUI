import { Action, action } from "easy-peasy";
import ElectronStore from "electron-store";

export interface IdiomModel {
  language:
    | "ch"
    | "de"
    | "en"
    | "es"
    | "fa"
    | "fr"
    | "it"
    | "pl"
    | "pr"
    | "ru"
    | "tr"
    | "ua"
    | "sl";
  setLanguage: Action<
    IdiomModel,
    | "ch"
    | "de"
    | "en"
    | "es"
    | "fa"
    | "fr"
    | "it"
    | "pl"
    | "pr"
    | "ru"
    | "tr"
    | "ua"
    | "sl"
  >;
}

const AsyncStore = {
  electronStore: new ElectronStore<IdiomModel>({}),
  getItem(key: any, defaultValue: any) {
    const value = this.electronStore.get(key);
    if (value == null) {
      return defaultValue;
    }

    return value;
  },
  setItem(key: any, data: any) {
    this.electronStore.set(key, data);
  },
  removeItem(key: any) {
    this.electronStore.delete(key);
  },
};

const idiom: IdiomModel = {
  language: AsyncStore.getItem("language", "en"),
  setLanguage: action((state, language) => {
    AsyncStore.setItem("language", language);
    state.language = language;
  }),
};

export default idiom;
