
export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED" | "REJECTED" | "PAYMENT_FAILED";
export type OrderType = "DELIVERY" | "PICKUP" | "DINE_IN";
export type PaymentType = "CASH" | "CARD" | "ONLINE";

export interface VariantOption {
  id: string;
  name: string;
  price: number;
}

export interface OrderItemOption {
  id: string;
  variantOption: VariantOption;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    image?: string;
  };
  options: OrderItemOption[];
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO String for frontend
  ordertype: OrderType;
  paymenttype: PaymentType;
  user?: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  orderItems: OrderItem[];
}