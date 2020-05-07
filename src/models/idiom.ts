import { Action, action } from "easy-peasy";

export interface IdiomModel {
  language: "ch" | "de" | "en" | "es" | "pr" | "ru" | "tr";
  setLanguage: Action<
    IdiomModel,
    "ch" | "de" | "en" | "es" | "pr" | "ru" | "tr"
  >;
}

const idiom: IdiomModel = {
  language: "en",
  setLanguage: action((state, language) => {
    state.language = language;
  }),
};

export default idiom;
