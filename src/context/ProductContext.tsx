import {
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { ProductContext } from "./ProductContextDefinition";
import type { Product } from "../interfaces/Product";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_BACKEND_URL + "/products";

export const ProductContextProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Función para obterner productos
  const getProducts = useCallback(async () => {
    // setProductsLoading(true);
    // setProduct({}); //Resetear el producto anterior

    try {
      const response = await axios.get(API_URL);
      console.log("responseeeeee", response);
      setProducts(response.data.products);
    } catch (error) {
      setError((error as Error).message || "Error al obtener los productos");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  //Funcion para obtener un producto por id
  const getProductById = useCallback(async (id: string) => {
    setProductLoading(true);
    setProduct(null);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      setError((error as Error).message || "Error al obtener el producto");
    } finally {
      setProductLoading(false);
    }
  }, []);

  // Función para actualizar un producto
  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const cleanData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      images: data.images,
      videoUrl: data.videoUrl || null,
      videoSource: data.videoUrl ? data.videoSource : null,
    };

    try {
      const response = await axios.put(API_URL + `/${id}`, cleanData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        //Actualizar el producto individual
        setProduct(response.data.product);
        //Actualizar el producto en la lista de productos
        setProducts((preProducts) =>
          preProducts.map((product) =>
            product._id === id ? response.data.product : product
          )
        );
        return {
          success: true,
          message: "Producto actualizado correctamente",
        };
      }
      return {
        success: false,
        message: "Error al actualizar el producto",
      };
    } catch (error) {
      setError((error as Error).message || "Error al actualizar el producto");
      return {
        success: false,
        message: "Error al actualizar el producto",
      };
    } finally {
      setProductsLoading(false);
      setProductLoading(false);
    }
  }, []);

  // Funcion para crear un producto
  const createProduct = useCallback(async (data: Omit<Product, '_id'>) => {
    const cleanData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      images: data.images,
      videoUrl: data.videoUrl || null,
      videoSource: data.videoUrl ? data.videoSource : null,
    };
    try {
      const response = await axios.post(API_URL, cleanData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setProducts((prevProducts) => [...prevProducts, response.data.product]);
        return {
          success: true,
          message: response.data.message,
        };
      }
      return {
        success: false,
        message: "Error al crear el producto",
      };
    } catch (error) {
      setError((error as Error).message || "Error al crear el producto");
      return {
        success: false,
        message: (error as Error).message || "Error al crear el producto",
      };
    } finally {
      setProductLoading(false);
    }
  }, []);

  // Funcion para eliminar un producto
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await axios.delete(API_URL + `/${id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        return {
          success: true,
          message: "Producto eliminado correctamente",
        };
      }
      return {
        success: false,
        message: "Error al eliminar el producto",
      };
    } catch (error) {
      setError((error as Error).message || "Error al eliminar el producto");
      return {
        success: false,
        message: "Error al eliminar el producto",
      };
    } finally {
      setProductLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const value = {
    products,
    product,
    productsLoading,
    productLoading,
    error,
    getProducts,
    loadProducts: getProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct,
  };
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
