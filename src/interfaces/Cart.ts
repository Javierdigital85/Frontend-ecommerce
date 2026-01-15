// Product Interface (matches backend IProduct)
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

// CartItem for frontend use (extends Product with quantity)
export interface CartItem extends Product {
  quantity: number;
}

// Backend Cart Item structure
export interface ICartItem {
  productId: Product;
  quantity: number;
}

// Backend Cart Response
export interface ICart {
  userId: string;
  products: ICartItem[];
}

export interface UserContextType {
  getUserId: () => string;
  isAuthenticated: () => boolean;
  loading: boolean;
  userInfo: { id?: string } | null;
}

export interface CartContextValue {
  cart: CartItem[];
  total: number;
  itemsQuantity: number;
  isModalOpen: boolean;
  closeModal: () => void;
  loading: boolean;
  addToCart: (product: CartItem, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openModal: () => void;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  loadCart: () => Promise<void>;
}
