/**
 * Review Service
 * All review-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type {
  Review,
  ReviewFilters,
  CreateReviewRequest,
  ReviewStatistics,
  PaginatedResponse,
} from '@/types/api';

export const reviewService = {
  /**
   * Get list of reviews with optional filters
   */
  getAll: (filters?: ReviewFilters) => {
    const query = filters ? buildQueryString(filters) : '';
    return api.get<PaginatedResponse<Review>>(`${API_ENDPOINTS.REVIEWS.LIST}${query}`);
  },

  /**
   * Create a new review
   */
  create: (data: CreateReviewRequest, token: string) =>
    api.post<Review>(API_ENDPOINTS.REVIEWS.CREATE, data, token),

  /**
   * Get review statistics for a material
   */
  getStatistics: (matlId: number | string) =>
    api.get<ReviewStatistics>(API_ENDPOINTS.REVIEWS.STATISTICS(matlId)),
};
