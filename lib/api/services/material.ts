/**
 * Material/Product Service
 * All product-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type {
  Material,
  MaterialFilters,
  PaginatedResponse,
  ColorOption,
} from '@/types/api';

export const materialService = {
  /**
   * Get list of materials with filtering and pagination
   */
  getAll: (filters?: MaterialFilters) => {
    const query = filters ? buildQueryString(filters) : '';
    return api.get<PaginatedResponse<Material>>(`${API_ENDPOINTS.MATERIALS.LIST}${query}`);
  },

  /**
   * Get material detail by ID
   */
  getById: (id: number | string) =>
    api.get<Material>(API_ENDPOINTS.MATERIALS.DETAIL(id)),

  /**
   * Get only promotional materials
   */
  getPromotions: (filters?: MaterialFilters) => {
    const query = filters ? buildQueryString(filters) : '';
    return api.get<PaginatedResponse<Material>>(`${API_ENDPOINTS.MATERIALS.PROMOTIONS}${query}`);
  },

  /**
   * Get all available categories
   */
  getCategories: () =>
    api.get<string[]>(API_ENDPOINTS.MATERIALS.CATEGORIES),

  /**
   * Get all available brands
   */
  getBrands: () =>
    api.get<string[]>(API_ENDPOINTS.MATERIALS.BRANDS),

  /**
   * Get all available sizes
   */
  getSizes: () =>
    api.get<string[]>(API_ENDPOINTS.MATERIALS.SIZES),

  /**
   * Get all available colors
   */
  getColors: () =>
    api.get<ColorOption[]>(API_ENDPOINTS.MATERIALS.COLORS),
};
