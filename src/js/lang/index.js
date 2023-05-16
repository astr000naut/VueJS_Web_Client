import vnMessage from "./vn.json";
import enMessage from "./en.json";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "vi",
  messages: {
    vi: vnMessage,
    en: enMessage,
  },
});

export default i18n;
