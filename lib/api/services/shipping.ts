/**
 * Shipping Service
 * All shipping-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type {
  Province,
  City,
  CalculateShippingRequest,
  CalculateShippingResponse,
  CalculateMultipleRequest,
  CheapestShippingResponse,
} from '@/types/api';

export const shippingService = {
  /**
   * Get all provinces
   */
  getProvinces: () =>
    api.get<Province[]>(API_ENDPOINTS.SHIPPING.PROVINCES),

  /**
   * Get cities by province
   */
  getCities: (provinceId?: string) => {
    const query = provinceId ? buildQueryString({ province_id: provinceId }) : '';
    return api.get<City[]>(`${API_ENDPOINTS.SHIPPING.CITIES}${query}`);
  },

  /**
   * Calculate shipping cost for single courier
   */
  calculate: (data: CalculateShippingRequest, token: string) =>
    api.post<CalculateShippingResponse>(
      API_ENDPOINTS.SHIPPING.CALCULATE,
      data,
      token
    ),

  /**
   * Calculate shipping cost for multiple couriers
   */
  calculateMultiple: (data: CalculateMultipleRequest, token: string) =>
    api.post<CalculateShippingResponse[]>(
      API_ENDPOINTS.SHIPPING.CALCULATE_MULTIPLE,
      data,
      token
    ),

  /**
   * Get cheapest shipping option
   */
  getCheapest: (data: CalculateMultipleRequest, token: string) =>
    api.post<CheapestShippingResponse>(
      API_ENDPOINTS.SHIPPING.CHEAPEST,
      data,
      token
    ),
};
