import { createContext } from "react";
import type { LanguageContextType } from "../interfaces/Language";

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
