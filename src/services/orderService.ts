import axios from "axios";
import type { CreateOrderData } from "../interfaces/Order";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/orders";

axios.defaults.withCredentials = true;

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderData);
    return response.data;
  } catch {
    throw new Error("Error al crear la orden");
  }
};
