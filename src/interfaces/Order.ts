// MercadoPago Item (formato de la API)
export interface MercadoPagoItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  currency_id?: string;
}

// MercadoPago Data
export interface MercadoPagoData {
  preferenceId?: string;
  payerEmail?: string;
  paymentId?: string;
  paymentStatus?:
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "in_process";
  transactionAmount?: number;
  paymentMethod?: string;
  paidAt?: Date;
}

// Shipping Address
export interface ShippingAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

// Shipping Info
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: ShippingAddress;
}

// Order Product (simplified for frontend)
export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Order interface for frontend
export interface Order {
  _id?: string;
  userId?: string;
  products: OrderProduct[];
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "in_process";
  mercadoPagoData?: MercadoPagoData;
  shippingInfo: ShippingInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create Order Data (what we send to backend)
export interface CreateOrderData {
  items: MercadoPagoItem[];
  payer: {
    email: string;
  };
  shippingInfo: ShippingInfo;
}
