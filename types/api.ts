/**
 * API Type Definitions
 * All TypeScript interfaces and types for API requests and responses
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postal_code?: string;
  email_verified_at: string | null;
  avatar?: string | null;
  is_online_shop_customer?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface RegisterResponse {
  partner: User;
  token: string;
  email_sent: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  partner: User;
  token: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

// ============================================================================
// Banner Types
// ============================================================================

export interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_path: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_currently_active: boolean;
  display_order: number;
  link_url: string;
  materials_count: number;
  materials?: Material[];
  created_at: string;
}

export interface BannerListResponse {
  data: Banner[];
  meta: PaginationMeta;
}

// ============================================================================
// Material/Product Types
// ============================================================================

export interface MaterialSpecs {
  color_name?: string;
  color_code?: string;
  size?: string;
  ram?: string;
  storage?: string;
  [key: string]: any;
}

export interface Material {
  id: number;
  code: string;
  name: string;
  descr?: string;
  category?: string;
  brand?: string;
  type_code?: string;
  is_display?: boolean;
  is_promotion: boolean;
  promotion_price?: number;
  promotion_start_date?: string;
  promotion_end_date?: string;
  specs?: MaterialSpecs;
  price: number;
  final_price: number;
  discount_percentage?: number;
  avg_rating?: number;
  review_count?: number;
  image_url?: string;
  image_path?: string;
  images?: string[];
  rating_stats?: {
    [key: string]: number;
  };
  reviews?: PaginatedResponse<Review>;
}

export interface MaterialFilters {
  category?: string;
  brand?: string;
  search?: string;
  color?: string;
  size?: string;
  is_promotion?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ColorOption {
  name: string;
  code: string;
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItem {
  id: number;
  matl_id: number;
  matl_code: string;
  matl_name: string;
  qty: number;
  price: number;
  discount: number;
  subtotal: number;
  image_url?: string;
  notes?: string;
}

export interface Cart {
  cart_id: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

export interface AddToCartRequest {
  matl_id: number;
  qty: number;
  price: number;
  notes?: string;
}

export interface UpdateCartItemRequest {
  qty: number;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus = 'P' | 'C' | 'D' | 'S' | 'X';

export interface Order {
  id: number;
  order_no: string;
  order_date: string;
  status_code: OrderStatus;
  status_name: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_phone?: string;
  shipping_cost: number;
  shipping_courier?: string;
  notes?: string;
  items?: OrderItem[];
  subtotal?: number;
  total_amount: number;
  items_count: number;
  payment_status?: string;
  payment?: PaymentInfo;
}

export interface OrderItem {
  id: number;
  matl_id: number;
  matl_name: string;
  matl_code?: string;
  qty: number;
  price: number;
  discount: number;
  subtotal: number;
  image_url?: string;
}

export interface CheckoutRequest {
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  shipping_cost: number;
  shipping_courier: string;
  notes?: string;
}

export interface CheckoutResponse {
  order_id: number;
  order_no: string;
  total_amount: number;
  items_count: number;
  status: OrderStatus;
}

export interface OrderFilters {
  status_code?: OrderStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface CancelOrderRequest {
  reason: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentMethod {
  code: string;
  name: string;
  description: string;
  requires_proof: boolean;
}

export interface PaymentInfo {
  id?: number;
  tr_id?: string;
  payment_method?: string;
  status_code?: string;
  status_name?: string;
  status?: string;
  method?: string | null;
  amount?: number;
  proof_url?: string;
}

export interface UploadPaymentProofRequest {
  order_id: number;
  partner_id: number;
  payment_method: string;
  amount: number;
  payment_proof: File;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  notes?: string;
}

export interface UploadPaymentProofResponse {
  payment: PaymentInfo;
  proof_url: string;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: number;
  order_hdr_id?: number;
  matl_id?: number;
  rating: number;
  review: string;
  customer_name?: string;
  is_approved?: boolean;
  created_at: string;
  images?: string[];
}

export interface CreateReviewRequest {
  order_hdr_id: number;
  matl_id: number;
  rating: number;
  review: string;
  images?: string[];
}

export interface ReviewFilters {
  matl_id?: number;
  rating?: number;
  page?: number;
  per_page?: number;
}

export interface ReviewStatistics {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: string]: number;
  };
}

// ============================================================================
// Shipping Types
// ============================================================================

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface ShippingCost {
  service: string;
  description: string;
  cost: number;
  etd: string;
  note?: string | null;
}

export interface CalculateShippingRequest {
  origin: number;
  destination: number;
  weight: number;
  courier: string;
}

export interface CalculateShippingResponse {
  courier: string;
  code: string;
  costs: ShippingCost[];
}

export interface CalculateMultipleRequest {
  origin: number;
  destination: number;
  weight: number;
  couriers: string[];
}

export interface CheapestShippingResponse {
  courier: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}
