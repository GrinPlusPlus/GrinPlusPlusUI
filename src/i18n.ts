import Backend from "./electron-i18n-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getResourcePath } from "./helpers";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const fallbackLng = ["en"];
const availableLanguages = [
  "ch",
  "de",
  "en",
  "es",
  "fa",
  "fr",
  "it",
  "nl",
  "pl",
  "pr",
  "ru",
  "tr",
  "ua",
  "sl",
  "gr",
];

const options = {
  // order and from where user language should be detected
  order: ["navigator", "htmlTag", "path", "subdomain"],

  // keys or params to lookup language from
  lookupQuerystring: "lng",
  lookupLocalStorage: "i18nextLng",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,

  // only detect languages that are in the whitelist
  checkWhitelist: true,
};

i18n
  .use(Backend) // load translation using xhr -> see /public/locales. We will add locales in the next step
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    fallbackLng, // if user computer language is not on the list of available languages, than we will be using the fallback language specified earlier
    debug: true,
    whitelist: availableLanguages,
    detection: options,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: getResourcePath("./locales/{{lng}}/{{ns}}.json"),
    },
  });

export default i18n;
