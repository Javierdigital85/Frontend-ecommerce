import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const TIMEOUT_MS = 60_000; // 60s timeout for AI responses

export const postMessage = async (message: string, language: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      { message, language },
      { timeout: TIMEOUT_MS },
    );
    return response.data;
  } catch (error: any) {
    const serverMsg = error.response?.data?.error;
    if (serverMsg) throw new Error(serverMsg);
    if (error.code === "ECONNABORTED")
      throw new Error("Request timed out. Please try again.");
    throw new Error(
      "Unable to connect to the assistant. Please check your connection.",
    );
  }
};

export const postThreadId = async (
  threadId: string,
  message: string,
  language: string,
) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/${threadId}`,
      { message, language },
      { timeout: TIMEOUT_MS },
    );
    return response.data;
  } catch (error: any) {
    const serverMsg = error.response?.data?.error;
    if (serverMsg) throw new Error(serverMsg);
    if (error.code === "ECONNABORTED")
      throw new Error("Request timed out. Please try again.");
    throw new Error(
      "Unable to connect to the assistant. Please check your connection.",
    );
  }
};
