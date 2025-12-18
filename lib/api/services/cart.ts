/**
 * Cart Service
 * All shopping cart-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/api';

export const cartService = {
  /**
   * Get current user's cart
   */
  get: (token: string) =>
    api.get<Cart>(API_ENDPOINTS.CART.GET, token),

  /**
   * Add item to cart
   */
  addItem: (data: AddToCartRequest, token: string) =>
    api.post<{ cart_dtl_id: number; qty: number }>(
      API_ENDPOINTS.CART.ADD,
      data,
      token
    ),

  /**
   * Update cart item quantity
   */
  updateItem: (id: number | string, data: UpdateCartItemRequest, token: string) =>
    api.put(API_ENDPOINTS.CART.UPDATE(id), data, token),

  /**
   * Remove item from cart
   */
  removeItem: (id: number | string, token: string) =>
    api.delete(API_ENDPOINTS.CART.REMOVE(id), token),

  /**
   * Get cart item count
   */
  getCount: (token: string) =>
    api.get<{ count: number }>(API_ENDPOINTS.CART.COUNT, token),

  /**
   * Clear all items from cart
   */
  clear: (token: string) =>
    api.delete(API_ENDPOINTS.CART.CLEAR, token),
};
