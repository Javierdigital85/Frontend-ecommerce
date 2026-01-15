import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContextDefinition";
import { getProfileService } from "../services/authService";
import type { UserInfo } from "../interfaces/User";

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [loading, setLoading] = useState(true);

  //Funcion para verificar la sesión del usuario
  const checkSession = async () => {
    try {
      setLoading(true);
      const userData = await getProfileService();
      setUserInfo(userData);
    } catch (error) {
      console.log("No hay sesión activa", error);
      setUserInfo({});
    } finally {
      setLoading(false);
    }
  };

  //Funcion para obtener el id del usuario

  const getUserId = () => {
    return userInfo?.id || null;
  };

  //verificar si el usuario esta autenticado
  const isAuthenticated = () => {
    return !!userInfo?.id;
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        loading,
        checkSession,
        getUserId,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
