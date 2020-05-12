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
    | "pl"
    | "pr"
    | "ru"
    | "tr"
    | "ua";
  setLanguage: Action<
    IdiomModel,
    "ch" | "de" | "en" | "es" | "fa" | "fr" | "pl" | "pr" | "ru" | "tr" | "ua"
  >;
}

const AsyncStore = {
  electronStore: new ElectronStore<IdiomModel>(),
  getItem(key: any, defaultValue: any) {
    console.log("Getting item: " + key);
    const value = this.electronStore.get(key);
    if (value == null) {
      return defaultValue;
    }

    return value;
  },
  setItem(key: any, data: any) {
    console.log("Setting item: " + key);
    console.log(data);
    this.electronStore.set(key, data);
  },
  removeItem(key: any) {
    console.log("Removing item: " + key);
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
