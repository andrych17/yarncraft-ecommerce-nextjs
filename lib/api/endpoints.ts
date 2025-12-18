/**
 * API Endpoints Constants
 * Centralized location for all API endpoints
 */

const BASE_PATH = '/api/v1/trdretail1';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${BASE_PATH}/auth/register`,
    LOGIN: `${BASE_PATH}/auth/login`,
    LOGOUT: `${BASE_PATH}/auth/logout`,
    VERIFY_EMAIL: `${BASE_PATH}/auth/verify-email`,
    RESEND_VERIFICATION: `${BASE_PATH}/auth/resend-verification`,
    PROFILE: `${BASE_PATH}/auth/profile`,
    UPDATE_PROFILE: `${BASE_PATH}/auth/profile`,
    CHANGE_PASSWORD: `${BASE_PATH}/auth/change-password`,
    GOOGLE_LOGIN: `${BASE_PATH}/auth/google`,
  },

  // Banner Promotions
  BANNERS: {
    LIST: `${BASE_PATH}/banners`,
    ACTIVE: `${BASE_PATH}/banners/active`,
    DETAIL: (id: number | string) => `${BASE_PATH}/banners/${id}`,
    MATERIALS: (id: number | string) => `${BASE_PATH}/banners/${id}/materials`,
  },

  // Materials/Products
  MATERIALS: {
    LIST: `${BASE_PATH}/materials`,
    DETAIL: (id: number | string) => `${BASE_PATH}/materials/${id}`,
    PROMOTIONS: `${BASE_PATH}/materials/promotions`,
    CATEGORIES: `${BASE_PATH}/materials/categories`,
    BRANDS: `${BASE_PATH}/materials/brands`,
    SIZES: `${BASE_PATH}/materials/sizes`,
    COLORS: `${BASE_PATH}/materials/colors`,
  },

  // Shopping Cart
  CART: {
    GET: `${BASE_PATH}/cart`,
    ADD: `${BASE_PATH}/cart/add`,
    UPDATE: (id: number | string) => `${BASE_PATH}/cart/items/${id}`,
    REMOVE: (id: number | string) => `${BASE_PATH}/cart/items/${id}`,
    COUNT: `${BASE_PATH}/cart/count`,
    CLEAR: `${BASE_PATH}/cart/clear`,
  },

  // Orders
  ORDERS: {
    LIST: `${BASE_PATH}/orders`,
    DETAIL: (id: number | string) => `${BASE_PATH}/orders/${id}`,
    CHECKOUT: `${BASE_PATH}/orders/checkout`,
    CANCEL: (id: number | string) => `${BASE_PATH}/orders/${id}/cancel`,
  },

  // Payments
  PAYMENTS: {
    LIST: `${BASE_PATH}/payments`,
    DETAIL: (id: number | string) => `${BASE_PATH}/payments/${id}`,
    UPLOAD_PROOF: `${BASE_PATH}/payments`,
    METHODS: `${BASE_PATH}/payments/methods`,
  },

  // Reviews
  REVIEWS: {
    LIST: `${BASE_PATH}/reviews`,
    CREATE: `${BASE_PATH}/reviews`,
    STATISTICS: (matlId: number | string) => `${BASE_PATH}/reviews/statistics/${matlId}`,
  },

  // Shipping
  SHIPPING: {
    PROVINCES: `${BASE_PATH}/shipping/provinces`,
    CITIES: `${BASE_PATH}/shipping/cities`,
    CALCULATE: `${BASE_PATH}/shipping/calculate`,
    CALCULATE_MULTIPLE: `${BASE_PATH}/shipping/calculate-multiple`,
    CHEAPEST: `${BASE_PATH}/shipping/cheapest`,
  },
} as const;

// Helper function to build query string
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Helper to get full API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // Endpoint already includes BASE_PATH, just combine with base URL
  return `${baseUrl}${endpoint}`;
}
