/**
 * Payment Service
 * All payment-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  PaymentMethod,
  PaymentInfo,
  UploadPaymentProofResponse,
} from '@/types/api';

export const paymentService = {
  /**
   * Get available payment methods
   */
  getMethods: (token: string) =>
    api.get<PaymentMethod[]>(API_ENDPOINTS.PAYMENTS.METHODS, token),

  /**
   * Upload payment proof
   */
  uploadProof: (formData: FormData, token: string) =>
    api.upload<UploadPaymentProofResponse>(
      API_ENDPOINTS.PAYMENTS.UPLOAD_PROOF,
      formData,
      token
    ),

  /**
   * Get list of payments
   */
  getAll: (token: string) =>
    api.get<PaymentInfo[]>(API_ENDPOINTS.PAYMENTS.LIST, token),

  /**
   * Get payment detail by ID
   */
  getById: (id: number | string, token: string) =>
    api.get<PaymentInfo>(API_ENDPOINTS.PAYMENTS.DETAIL(id), token),
};
