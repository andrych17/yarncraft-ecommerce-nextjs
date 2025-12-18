/**
 * Cart Store (Legacy - Deprecated)
 * This store is deprecated. Use useCart() hook from @/hooks/useApi instead.
 * Keeping this file for backward compatibility only.
 * 
 * Migration guide:
 * Old: import { useCartStore } from '@/store/cart';
 * New: import { useCart } from '@/hooks/useApi';
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper function for currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Simple cart item type (deprecated)
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Cart state interface (deprecated)
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Deprecated: Use useCart() hook from @/hooks/useApi instead
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += item.quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper hook for cart badge count (deprecated)
export const useCartBadge = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  return totalItems;
};

// Helper hook for cart total (deprecated)
export const useCartTotal = () => {
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  return totalPrice;
};

