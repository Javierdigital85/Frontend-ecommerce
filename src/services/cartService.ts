import axios from "axios";

//Configurar base de axios
// http://localhost:3001/api/cart
const API_URL = import.meta.env.VITE_BACKEND_URL + "/cart";

axios.defaults.withCredentials = true;

//Servicio para agregar un producto al carrito
export const addToCartService = async (userId: string, productId: string, quantity = 1) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch {
    throw new Error("Error al agregar el producto al carrito");
  }
};

//Servicio para obtener el carrito de un usuario
export const getCartService = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/get/${userId}`);
    return response.data;
  } catch {
    throw new Error("Error al obtener el carrito");
  }
};

//Servicio para actualizar la cantidad de un producto en el carrito
export const updateCartService = async (userId: string, productId: string, quantity: number) => {
  try {
    const response = await axios.put(`${API_URL}/update/${userId}`, {
      productId,
      quantity,
    });
    return response.data;
  } catch {
    throw new Error("Error al actualizar el carrito");
  }
};

//Servicio para eliinar un producto del carrito
export const removeFromCartService = async (userId: string, productId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/removeProduct/${userId}`, {
      data: { productId },
    });
    return response.data;
  } catch {
    throw new Error("Error al eliminar un producto del carrito");
  }
};

//Para limpiar todo el carrito
export const clearCartService = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/clear/${userId}`);
    return response.data;
  } catch {
    throw new Error("Error al limpiar el carrito");
  }
};

//Servicio para obtener el tortal del carrito
export const getCartTotalService = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/total/${userId}`);
    return response.data;
  } catch {
    throw new Error("Error al obtener el total del carrito");
  }
};
