import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const applyDiscountService = async (productId: string, discountPercentage: number) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${productId}/discount`, {
      discountPercentage
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al aplicar descuento",{cause:error});
  }
};