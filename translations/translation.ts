export type Language = "en" | "ua";

export type TranslationKeys = "boxes" | "scan" | "settings" | "appLanguage" | "boxDetails";

export type Translations = {
  [key in Language]: {
    [k in TranslationKeys]: string;
  };
};

export const translations: Translations = {
  en: {
    boxes: "My Boxes",
    scan: "Scan",
    settings: "Settings",
    appLanguage: "App language",
    boxDetails: "Box details",
  },
  ua: {
    boxes: "Мої коробки",
    scan: "Сканувати",
    settings: "Налаштування",
    appLanguage: "Мова застосунку",
    boxDetails: "Деталі коробки",
  }
};
