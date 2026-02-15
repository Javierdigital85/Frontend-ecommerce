import { useLanguage } from "../context/useLanguage";
import { translations } from "../translation/translation";

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return { t };
};