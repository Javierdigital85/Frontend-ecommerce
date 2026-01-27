import axios from "axios";
import type { UseFormReset } from "react-hook-form";
import type { RegisterFormValues } from "../interfaces/RegisterForm";
import type { LoginFormValues } from "../interfaces/LoginForm";
import type { UserInfo } from "../interfaces/User";

//Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + "/auth";

//Para incluir la cookies en las peticiones
axios.defaults.withCredentials = true;

// http://localhost:3001/api/auth/register
// http://localhost:3001/api/auth/profile
// http://localhost:3001/api/auth/login
export const getProfileService = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    console.log("Respuesta /profile", response);
    return response.data;
  } catch {
    throw new Error("Error al obtener el perfil");
  }
};

export const loginService = async (
  data: LoginFormValues,
  reset: UseFormReset<LoginFormValues>,
  setRedirect: (redirect: boolean) => void,
  setUserInfo: (userInfo: UserInfo) => void
) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    //si la respuesta es exitosa
    if (response.status === 200) {
      setUserInfo(response.data);
      reset();
      setRedirect(true);
      return {
        success: true,
        message: "Inicio de sesión exitoso",
      };
    }
  } catch {
    return {
      success: false,
      message: "Error al iniciar sesión",
    };
  }
};

export const registerService = async (
  data: RegisterFormValues,
  reset: UseFormReset<RegisterFormValues>,
  setRedirect: (redirect: boolean) => void,
  checkSession: () => Promise<void>
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Respuesta", response);
    if (response.status === 201 || response.status === 200) {
      // alert("REGISTRO EXISOTO DEL USUARIO");
      await checkSession();
      reset();
      setRedirect(true);

      return {
        message: true,
      };
    }
  } catch {
    return {
      message: false,
    };
  }
};

export const logOutService = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);

    return response.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al cerrar la sesión"
    );
  }
};

export const updateUserService = async (userId: string, userData: Partial<UserInfo>) => {
  try {
    const res = await axios.put(`${API_URL}/updateUser/${userId}`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const axiosError = error as import("axios").AxiosError<{
      message?: string;
    }>;
    throw new Error(
      axiosError.response?.data?.message || "Error al actualizar el usuario"
    );
  }
};
