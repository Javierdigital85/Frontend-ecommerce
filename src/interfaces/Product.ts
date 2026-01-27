export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  discountedPrice?: number;
  stock: number;
  imageUrl: string;
}

export interface ProductContextValue {
  products: Product[];
  product: Product | null;
  productsLoading: boolean;
  productLoading: boolean;
  error: string | null;
  getProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<{ success: boolean; message: string }>;
  createProduct: (data: Omit<Product, '_id'>) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>;
}

export interface UpdateProductFormProps {
  product: Product;
}

export interface CardProductProps {
  product: Product;
}