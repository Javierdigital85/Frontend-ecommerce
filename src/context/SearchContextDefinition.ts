import { createContext } from "react";
import type { SearchContextType } from "../interfaces/Search";

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);
