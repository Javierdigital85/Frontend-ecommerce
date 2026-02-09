import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./CartContextDefinition";
import { useUser } from "./useUser";
import {
  addToCartService,
  getCartService,
  updateCartService,
  removeFromCartService,
  clearCartService,
} from "../services/cartService";
import toast from "react-hot-toast";
import type { CartItem, UserContextType, ICartItem } from "../interfaces/Cart";

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemsQuantity, setItemsQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    getUserId,
    isAuthenticated,
    loading: userLoading,
    userInfo,
  } = useUser() as UserContextType;

  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem("cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito local:", error);
      return [];
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar carrito local", error);
    }
  };

  const loadCart = async () => {
    if (isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        const response = await getCartService(userId);
        console.log("response cart", response);

        const carItems =
          response.cart?.products?.map((item: ICartItem) => ({
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            discountPercentage: item.productId.discountPercentage,
            discountedPrice: item.productId.discountedPrice,
            imageUrl: item.productId.imageUrl,
            description: item.productId.description,
            stock: item.productId.stock,
            quantity: item.quantity,
          })) || [];
        setCart(carItems);
      } catch (error) {
        console.log(
          "Error al cargar carrito del backend:",
          (error as Error).message,
        );
        const localCart = loadLocalCart();
        setCart(localCart);
      } finally {
        setLoading(false);
      }
    } else {
      const localCart = loadLocalCart();
      setCart(localCart);
    }
  };

  const syncCartWithBackend = async () => {
    const localCart = loadLocalCart();
    if (localCart.length > 0 && isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        for (const item of localCart) {
          try {
            await addToCartService(userId, item._id, item.quantity);
          } catch {
            console.error(`Error al sincronizar producto ${item.name}`);
          }
        }
        localStorage.removeItem("cart");
        await loadCart();
        toast.success("Carrito sincronizado con exito");
      } catch {
        console.error("Error al sincroniar carrito");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeCart = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (!isMounted) return;

      const previousAuthState = localStorage.getItem("wasAuthenticated");
      const currentAuthState = isAuthenticated();

      if (!previousAuthState && currentAuthState) {
        await syncCartWithBackend();
      } else {
        await loadCart();
      }
      localStorage.setItem("wasAuthenticated", currentAuthState.toString());
      setLoading(false);
    };
    initializeCart();
    return () => {
      isMounted = false;
    };
  }, [userLoading]);

  const addToCart = async (product: CartItem, quantity = 1) => {
    if (isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        await addToCartService(userId, product._id, quantity);
        await loadCart();
        toast.success("producto agregado al carrito");
        openModal();
      } catch {
        console.error("Erro al agregar producto al carrito");
        toast.error("Error al agregar producto al carrito");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const currentCart: CartItem[] = [...cart];
        const existingIndex = currentCart.findIndex(
          (item: CartItem) => item._id === product._id,
        );
        if (existingIndex > -1) {
          currentCart[existingIndex].quantity += quantity;
        } else {
          currentCart.push({ ...product, quantity });
        }
        setCart(currentCart);
        saveLocalCart(currentCart);
        toast.success("Producto agregado al carrito ");
        openModal();
      } catch (error) {
        console.error("Error al agregar al carrito local", error);
        toast.error("Error al agregar producto al carrito");
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        await removeFromCartService(userId, productId);
        await loadCart();
        toast.success("Producto eliminado del carrito");
      } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        toast.error("Error al eliminar producto del carrito");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const currentCart = cart.filter((item) => item._id !== productId);
        setCart(currentCart);
        saveLocalCart(currentCart);
        toast.success("Producto eliminado del carrito");
      } catch (error) {
        console.error("Error al eliminar producto del carrito local", error);
        toast.error("Error al eliminar producto del carrito local");
      }
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("La cantidad debe ser al menos 1");
      return;
    }
    if (isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        await updateCartService(userId, productId, newQuantity);
        await loadCart();
        toast.success("Cantidad actualizada");
      } catch (error) {
        console.error("Error al actualizar la cantidad", error);
        toast.error("Error al actualizar la cantidad");
      }
    } else {
      try {
        const currentCart = cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item,
        );
        setCart(currentCart);
        saveLocalCart(currentCart);
        toast.success("Cantidad actualizada");
      } catch (error) {
        console.error("Error al actualizar la cantidad local", error);
        toast.error("Error al actualizar la cantidad");
      }
    }
  };

  const clearCart = async () => {
    if (isAuthenticated()) {
      try {
        setLoading(true);
        const userId = getUserId();
        await clearCartService(userId);
        setCart([]);
        toast.success("Carrito vacio");
      } catch (error) {
        console.error("Error al vaciar el carrito ", error);
        toast.error("Error al vaciar el carrito");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setCart([]);
        saveLocalCart([]);
        toast.success("Carrito vacio");
      } catch (error) {
        console.error("Error al vaciar el carrito local", error);
        toast.error("Error al vaciar el carrito local");
      }
    }
  };

  useEffect(() => {
    const previousAuthState =
      localStorage.getItem("wasAuthenticated") == "true";

    const currentAuthState = isAuthenticated();

    if (previousAuthState !== currentAuthState && cart.length === 0) {
      loadCart();
      localStorage.setItem("wasAuthenticated", currentAuthState.toString());
    }
  }, []);

  useEffect(() => {
    if (userLoading) return;

    if (userInfo?.id) {
      (async () => {
        try {
          const localCart = loadLocalCart();
          if (localCart.length > 0) {
            await syncCartWithBackend();
          } else {
            await loadCart();
          }
        } catch (error) {
          console.error(
            "Error al sincronizar/cargar carrito tras login",
            error,
          );
        }
      })();
    } else {
      try {
        setCart(loadLocalCart());
      } catch (error) {
        console.error("Error al cargar carrito local tras logout", error);
      }
    }
  }, [userInfo?.id, userLoading]);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => {
      const finalPrice = item.discountedPrice || item.price;
      return acc + finalPrice * (item.quantity || 1);
    }, 0);
    setTotal(Math.round(newTotal * 100) / 100);
    const newItemsQuantity = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0,
    );

    setItemsQuantity(newItemsQuantity);
  }, [cart]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        itemsQuantity,
        isModalOpen,
        closeModal,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        openModal,
        updateQuantity,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
