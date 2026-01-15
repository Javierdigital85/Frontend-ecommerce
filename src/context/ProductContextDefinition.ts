import { createContext } from "react";
import type { ProductContextValue } from "../interfaces/Product";

export const ProductContext = createContext<ProductContextValue>({} as ProductContextValue);