import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const postMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al enviar mensaje", { cause: error });
  }
};

export const postThreadId = async (threadId: string, message: string) => {
  try {
    const response = await axios.post(`${API_URL}/chat/${threadId}`, {
      message,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al enviar mensaje", { cause: error });
  }
};
