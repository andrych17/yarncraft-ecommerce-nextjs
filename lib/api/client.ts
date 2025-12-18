/**
 * API Client
 * Centralized HTTP client for all API requests with error handling
 */

import { getApiUrl } from './endpoints';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  token?: string;
  isFormData?: boolean;
  cache?: RequestCache;
  revalidate?: number;
}

/**
 * Main API client function
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    token,
    isFormData = false,
    cache,
    revalidate,
  } = options;

  // Build headers
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  if (cache) {
    config.cache = cache;
  }

  if (revalidate !== undefined) {
    config.next = { revalidate };
  }

  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, config);

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'API request failed',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: <T = any>(endpoint: string, token?: string, options?: Omit<RequestOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET', token }),

  post: <T = any>(endpoint: string, body?: any, token?: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body, token }),

  put: <T = any>(endpoint: string, body?: any, token?: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body, token }),

  delete: <T = any>(endpoint: string, token?: string, options?: Omit<RequestOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE', token }),

  upload: <T = any>(endpoint: string, formData: FormData, token?: string, options?: Omit<RequestOptions, 'method' | 'body' | 'isFormData'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body: formData, isFormData: true, token }),
};

/**
 * Client-side token management
 */
export const tokenStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  set: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },

  remove: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  },
};

/**
 * User data storage
 */
export const userStorage = {
  get: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  set: (user: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  remove: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },
};

/**
 * Error handler helper
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      // Return first validation error
      const firstError = Object.values(error.errors)[0];
      return firstError?.[0] || error.message;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
