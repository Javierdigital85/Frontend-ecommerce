import { createContext } from "react";
import type { CartContextValue } from "../interfaces/Cart";

export const CartContext = createContext<CartContextValue>({} as CartContextValue);
