/**
 * Banner Service
 * All banner/promotion-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type { Banner, BannerListResponse } from '@/types/api';

interface BannerFilters {
  active_only?: boolean;
  per_page?: number;
  no_pagination?: boolean;
  page?: number;
}

export const bannerService = {
  /**
   * Get all banners with optional filters
   */
  getAll: (filters?: BannerFilters) => {
    const query = filters ? buildQueryString(filters) : '';
    return api.get<BannerListResponse>(`${API_ENDPOINTS.BANNERS.LIST}${query}`);
  },

  /**
   * Get only active banners (for homepage)
   */
  getActive: () =>
    api.get<Banner[]>(API_ENDPOINTS.BANNERS.ACTIVE),

  /**
   * Get banner detail by ID
   */
  getById: (id: number | string) =>
    api.get<Banner>(API_ENDPOINTS.BANNERS.DETAIL(id)),

  /**
   * Get materials/products associated with a banner
   */
  getMaterials: (id: number | string) =>
    api.get(API_ENDPOINTS.BANNERS.MATERIALS(id)),
};
