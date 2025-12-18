/**
 * Custom Hooks for API Data Fetching
 * React hooks for fetching and managing API data with automatic revalidation
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { materialService } from '@/lib/api/services/material';
import { bannerService } from '@/lib/api/services/banner';
import { cartService } from '@/lib/api/services/cart';
import { orderService } from '@/lib/api/services/order';
import { shippingService } from '@/lib/api/services/shipping';
import { reviewService } from '@/lib/api/services/review';
import type {
  MaterialFilters,
  OrderFilters,
  ReviewFilters,
} from '@/types/api';

// ============================================================================
// Generic Hook for Data Fetching
// ============================================================================

interface UseDataOptions<T> {
  fetcher: () => Promise<T>;
  deps?: any[];
  enabled?: boolean;
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
}

function useData<T>(options: UseDataOptions<T>) {
  const { fetcher, deps = [], enabled = true, revalidateOnFocus = false, refreshInterval } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    fetchData();
  }, [...deps, fetchData]);

  // Revalidate on window focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, fetchData]);

  // Auto refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  };
}

// ============================================================================
// Materials/Products Hooks
// ============================================================================

export function useMaterials(filters: MaterialFilters = {}) {
  return useData({
    fetcher: async () => {
      const response = await materialService.getAll(filters);
      return response.data;
    },
    deps: [JSON.stringify(filters)],
  });
}

export function useMaterial(id: number | string | null) {
  return useData({
    fetcher: async () => {
      if (!id) throw new Error('Material ID is required');
      const response = await materialService.getById(id);
      return response.data;
    },
    deps: [id],
    enabled: !!id,
  });
}

export function usePromotions(filters: MaterialFilters = {}) {
  return useData({
    fetcher: async () => {
      const response = await materialService.getPromotions(filters);
      return response.data;
    },
    deps: [JSON.stringify(filters)],
  });
}

export function useCategories() {
  return useData({
    fetcher: async () => {
      const response = await materialService.getCategories();
      return response.data;
    },
    deps: [],
  });
}

export function useBrands() {
  return useData({
    fetcher: async () => {
      const response = await materialService.getBrands();
      return response.data;
    },
    deps: [],
  });
}

// ============================================================================
// Banner Hooks
// ============================================================================

export function useActiveBanners() {
  return useData({
    fetcher: async () => {
      const response = await bannerService.getActive();
      return response.data;
    },
    deps: [],
    refreshInterval: 60000, // Refresh every minute
  });
}

export function useBanner(id: number | string | null) {
  return useData({
    fetcher: async () => {
      if (!id) throw new Error('Banner ID is required');
      const response = await bannerService.getById(id);
      return response.data;
    },
    deps: [id],
    enabled: !!id,
  });
}

// ============================================================================
// Cart Hooks
// ============================================================================

export function useCart() {
  const { token, isAuthenticated } = useAuth();
  const [mutateKey, setMutateKey] = useState(0);

  const { data, error, isLoading, refetch } = useData({
    fetcher: async () => {
      if (!token) return null;
      const response = await cartService.get(token);
      return response.data;
    },
    deps: [token, mutateKey],
    enabled: isAuthenticated,
    revalidateOnFocus: true,
  });

  const mutate = useCallback(() => {
    setMutateKey((prev) => prev + 1);
  }, []);

  const addItem = useCallback(
    async (matlId: number, qty: number, price: number, notes?: string) => {
      if (!token) throw new Error('Not authenticated');
      await cartService.addItem({ matl_id: matlId, qty, price, notes }, token);
      mutate();
    },
    [token, mutate]
  );

  const updateItem = useCallback(
    async (id: number, qty: number) => {
      if (!token) throw new Error('Not authenticated');
      await cartService.updateItem(id, { qty }, token);
      mutate();
    },
    [token, mutate]
  );

  const removeItem = useCallback(
    async (id: number) => {
      if (!token) throw new Error('Not authenticated');
      await cartService.removeItem(id, token);
      mutate();
    },
    [token, mutate]
  );

  const clearCart = useCallback(async () => {
    if (!token) throw new Error('Not authenticated');
    await cartService.clear(token);
    mutate();
  }, [token, mutate]);

  return {
    cart: data,
    error,
    isLoading,
    refetch,
    mutate,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}

export function useCartCount() {
  const { token, isAuthenticated } = useAuth();

  return useData({
    fetcher: async () => {
      if (!token) return 0;
      const response = await cartService.getCount(token);
      return response.data?.count || 0;
    },
    deps: [token],
    enabled: isAuthenticated,
    refreshInterval: 30000, // Refresh every 30 seconds
  });
}

// ============================================================================
// Order Hooks
// ============================================================================

export function useOrders(filters: OrderFilters = {}) {
  const { token, isAuthenticated } = useAuth();

  return useData({
    fetcher: async () => {
      if (!token) return null;
      const response = await orderService.getAll(filters, token);
      return response.data;
    },
    deps: [token, JSON.stringify(filters)],
    enabled: isAuthenticated,
  });
}

export function useOrder(id: number | string | null) {
  const { token, isAuthenticated } = useAuth();

  return useData({
    fetcher: async () => {
      if (!token || !id) return null;
      const response = await orderService.getById(id, token);
      return response.data;
    },
    deps: [token, id],
    enabled: isAuthenticated && !!id,
  });
}

// ============================================================================
// Shipping Hooks
// ============================================================================

export function useProvinces() {
  return useData({
    fetcher: async () => {
      const response = await shippingService.getProvinces();
      return response.data;
    },
    deps: [],
  });
}

export function useCities(provinceId?: string) {
  return useData({
    fetcher: async () => {
      const response = await shippingService.getCities(provinceId);
      return response.data;
    },
    deps: [provinceId],
    enabled: !!provinceId,
  });
}

// ============================================================================
// Review Hooks
// ============================================================================

export function useReviews(filters?: ReviewFilters) {
  return useData({
    fetcher: async () => {
      const response = await reviewService.getAll(filters);
      return response.data;
    },
    deps: [JSON.stringify(filters)],
  });
}

export function useReviewStatistics(matlId: number | string | null) {
  return useData({
    fetcher: async () => {
      if (!matlId) return null;
      const response = await reviewService.getStatistics(matlId);
      return response.data;
    },
    deps: [matlId],
    enabled: !!matlId,
  });
}
