import { createContext } from "react";
import type { UserContextValue } from "../interfaces/User";
// Crea el contenedor vacio y se llena el contenedor con la informacion de userContext.ts que luego es leida por useUser.ts
export const UserContext = createContext<UserContextValue>({} as UserContextValue);
