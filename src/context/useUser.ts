import { useContext } from "react";
import { UserContext } from "./UserContextDefinition";
// Lee el contenedor o consume los datos
export const useUser = () => useContext(UserContext);
