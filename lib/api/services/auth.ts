/**
 * Authentication Service
 * All auth-related API calls
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
} from '@/types/api';

export const authService = {
  /**
   * Register a new customer account
   */
  register: (data: RegisterRequest) =>
    api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

  /**
   * Login with email and password
   */
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  /**
   * Logout current user
   */
  logout: (token: string) =>
    api.post(API_ENDPOINTS.AUTH.LOGOUT, {}, token),

  /**
   * Verify email with code
   */
  verifyEmail: (data: VerifyEmailRequest) =>
    api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),

  /**
   * Resend verification code
   */
  resendVerification: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email }),

  /**
   * Get current user profile
   */
  getProfile: (token: string) =>
    api.get<User>(API_ENDPOINTS.AUTH.PROFILE, token),

  /**
   * Update user profile
   */
  updateProfile: (data: UpdateProfileRequest, token: string) =>
    api.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data, token),

  /**
   * Change password
   */
  changePassword: (data: ChangePasswordRequest, token: string) =>
    api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data, token),
};
