/**
 * Order Service
 * All order-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type {
  Order,
  OrderFilters,
  CheckoutRequest,
  CheckoutResponse,
  CancelOrderRequest,
  PaginatedResponse,
} from '@/types/api';

export const orderService = {
  /**
   * Get list of orders with optional filters
   */
  getAll: (filters: OrderFilters, token: string) => {
    const query = buildQueryString(filters);
    return api.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS.LIST}${query}`, token);
  },

  /**
   * Get order detail by ID
   */
  getById: (id: number | string, token: string) =>
    api.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id), token),

  /**
   * Checkout - Create order from cart
   */
  checkout: (data: CheckoutRequest, token: string) =>
    api.post<CheckoutResponse>(API_ENDPOINTS.ORDERS.CHECKOUT, data, token),

  /**
   * Cancel an order
   */
  cancel: (id: number | string, data: CancelOrderRequest, token: string) =>
    api.post(API_ENDPOINTS.ORDERS.CANCEL(id), data, token),
};
