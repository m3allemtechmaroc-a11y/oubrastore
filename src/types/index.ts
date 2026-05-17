export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  sku?: string | null;
  images: string[];
  categoryId?: string | null;
  category?: Category | null;
  isPromotion: boolean;
  discountPercent?: number | null;
  promotionEnd?: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  children?: Category[];
  products?: Product[];
  orderIndex: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  whatsappSent: boolean;
  couponCode?: string | null;
  discount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  name: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  orderIndex: number;
  isActive: boolean;
}

export interface NavbarItem {
  id: string;
  label: string;
  href: string;
  orderIndex: number;
  isActive: boolean;
  isMegaMenu: boolean;
  categories?: Category[];
}

export interface Activity {
  id: string;
  title: string;
  image?: string | null;
  description?: string | null;
  buttonText: string;
  buttonLink?: string | null;
  orderIndex: number;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: "ADMIN" | "CLIENT";
  avatar?: string | null;
  createdAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface OrderForm {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  ordersByStatus: { status: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}
