import axios from "axios";
import type { CreateOrderData } from "../interfaces/Order";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/orders";

axios.defaults.withCredentials = true;

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    console.log("🟡 [ORDER SERVICE] Enviando petición a:", `${API_URL}/create`);
    console.log("🟡 [ORDER SERVICE] Datos enviados:", orderData);

    const response = await axios.post(`${API_URL}/create`, orderData);

    console.log("🟡 [ORDER SERVICE] Respuesta recibida:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [ORDER SERVICE] Error completo:", error);
    console.error("🔴 [ORDER SERVICE] Error response:", error.response?.data);
    console.error("🔴 [ORDER SERVICE] Error status:", error.response?.status);
    console.error("🔴 [ORDER SERVICE] Error message:", error.message);
    throw new Error("Error al crear la orden");
  }
};
