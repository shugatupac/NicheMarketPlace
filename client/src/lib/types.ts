export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  supplierId: number;
  categoryId: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  supplier?: Supplier;
  category?: Category;
  reviews?: ReviewWithUser[];
}

export interface Supplier {
  id: number;
  userId: number;
  businessName: string;
  location: string;
  description: string;
  story?: string;
  logo?: string;
  coverImage?: string;
  founded?: string;
  verified: boolean;
  products?: Product[];
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewWithUser extends Review {
  user: {
    id: number;
    name: string;
  } | null;
}

export interface Auction {
  id: number;
  productId: number;
  startPrice: number;
  currentPrice: number;
  startTime: string;
  endTime: string;
  status: "active" | "ended" | "cancelled";
  bidCount: number;
  winnerId: number | null;
  product?: Product;
  bids?: BidWithUser[];
}

export interface Bid {
  id: number;
  auctionId: number;
  userId: number;
  amount: number;
  createdAt: string;
}

export interface BidWithUser extends Bid {
  user: {
    id: number;
    name: string;
  } | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "buyer" | "supplier" | "admin";
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface Order {
  id: number;
  userId: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}
