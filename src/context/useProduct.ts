import { useContext } from "react";
import { ProductContext } from "./ProductContextDefinition";

export const useProduct = () => useContext(ProductContext);