import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./assets/locales/en.json";
import fr from "./assets/locales/fr.json";
import hi from "./assets/locales/hi.json";
import bn from "./assets/locales/bn.json";
i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next) // pass to react
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      hi: { translation: hi },
      bn: { translation: bn }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
