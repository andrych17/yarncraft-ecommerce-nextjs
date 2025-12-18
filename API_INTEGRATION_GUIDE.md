# API Integration Documentation

This project implements a comprehensive API integration layer following best practices for Next.js 15 and React 19.

## 📁 Project Structure

```
lib/
├── api/
│   ├── client.ts          # HTTP client with error handling
│   ├── endpoints.ts       # All API endpoint constants
│   ├── index.ts          # Main export file
│   └── services/         # API service layer
│       ├── auth.ts       # Authentication services
│       ├── banner.ts     # Banner/promotion services
│       ├── cart.ts       # Shopping cart services
│       ├── material.ts   # Product/material services
│       ├── order.ts      # Order services
│       ├── payment.ts    # Payment services
│       ├── review.ts     # Review services
│       ├── shipping.ts   # Shipping services
│       └── index.ts      # Services export

types/
└── api.ts                # TypeScript type definitions

contexts/
└── AuthContext.tsx       # Authentication context provider

hooks/
└── useApi.ts            # Custom React hooks for data fetching
```

## 🚀 Getting Started

### 1. Environment Setup

Create `.env.local` file (already created):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1/trdretail1
API_URL=http://localhost:8000/api/v1/trdretail1
```

### 2. Wrap Your App with AuthProvider

Already done in `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {/* Your app */}
    </AuthProvider>
  );
}
```

## 📖 Usage Examples

### Authentication

#### Using the Auth Context

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <form onSubmit={handleLogin}>
          {/* Login form */}
        </form>
      )}
    </div>
  );
}
```

#### Using Auth Service Directly

```tsx
import { authService } from '@/lib/api';

async function register(data) {
  try {
    const response = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      password_confirmation: 'SecurePass123',
      phone: '08123456789',
      address: 'Jl. Example',
      city: 'Jakarta',
      postal_code: '12345'
    });
    
    if (response.data) {
      console.log('Registered successfully:', response.data);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}
```

### Products/Materials

#### Using Custom Hook

```tsx
'use client';

import { useMaterials } from '@/hooks/useApi';

export default function ProductsPage() {
  const { data, isLoading, error } = useMaterials({
    page: 1,
    per_page: 12,
    is_promotion: true,
    sort_by: 'price',
    sort_order: 'asc'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Rp {product.final_price.toLocaleString('id-ID')}</p>
          {product.is_promotion && (
            <span>-{product.discount_percentage}%</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### Using Service Directly

```tsx
import { materialService } from '@/lib/api';

async function fetchProducts() {
  const response = await materialService.getAll({
    category: 'ELECTRONICS',
    min_price: 100000,
    max_price: 5000000
  });
  
  return response.data;
}
```

### Shopping Cart

#### Using Cart Hook

```tsx
'use client';

import { useCart } from '@/hooks/useApi';

export default function CartPage() {
  const { 
    cart, 
    isLoading, 
    addItem, 
    updateItem, 
    removeItem, 
    clearCart 
  } = useCart();

  const handleAddToCart = async (productId: number, price: number) => {
    try {
      await addItem(productId, 1, price);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    try {
      await updateItem(itemId, newQty);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  if (isLoading) return <div>Loading cart...</div>;

  return (
    <div>
      <h1>Shopping Cart ({cart?.total_items || 0} items)</h1>
      {cart?.items.map((item) => (
        <div key={item.id}>
          <h3>{item.matl_name}</h3>
          <p>Qty: {item.qty}</p>
          <p>Subtotal: Rp {item.subtotal.toLocaleString('id-ID')}</p>
          <button onClick={() => handleUpdateQty(item.id, item.qty + 1)}>
            +
          </button>
          <button onClick={() => handleUpdateQty(item.id, item.qty - 1)}>
            -
          </button>
          <button onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <div>
        <h2>Total: Rp {cart?.total_amount.toLocaleString('id-ID')}</h2>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
```

### Banners

```tsx
'use client';

import { useActiveBanners } from '@/hooks/useApi';
import Image from 'next/image';

export default function HomeBanner() {
  const { data: banners, isLoading } = useActiveBanners();

  if (isLoading) return <div>Loading banners...</div>;

  return (
    <div className="carousel">
      {banners?.map((banner) => (
        <div key={banner.id}>
          <Image
            src={banner.image_url}
            alt={banner.title}
            width={1200}
            height={400}
          />
          <h2>{banner.title}</h2>
          <p>{banner.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Orders

```tsx
'use client';

import { useOrders } from '@/hooks/useApi';

export default function OrdersPage() {
  const { data, isLoading } = useOrders({ page: 1 });

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div>
      {data?.data.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.order_no}</h3>
          <p>Status: {order.status_name}</p>
          <p>Total: Rp {order.total_amount.toLocaleString('id-ID')}</p>
          <p>Date: {new Date(order.order_date).toLocaleDateString('id-ID')}</p>
        </div>
      ))}
    </div>
  );
}
```

### Checkout

```tsx
'use client';

import { useState } from 'react';
import { orderService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    
    setLoading(true);
    try {
      const response = await orderService.checkout({
        shipping_address: formData.get('address') as string,
        shipping_city: formData.get('city') as string,
        shipping_postal_code: formData.get('postal_code') as string,
        shipping_phone: formData.get('phone') as string,
        shipping_cost: Number(formData.get('shipping_cost')),
        shipping_courier: formData.get('courier') as string,
        notes: formData.get('notes') as string || undefined,
      }, token);

      if (response.data) {
        router.push(`/orders/${response.data.order_id}/payment`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout}>
      <input name="address" placeholder="Shipping Address" required />
      <input name="city" placeholder="City" required />
      <input name="postal_code" placeholder="Postal Code" required />
      <input name="phone" placeholder="Phone" required />
      <input name="shipping_cost" type="number" placeholder="Shipping Cost" required />
      <select name="courier" required>
        <option value="JNE REG">JNE Regular</option>
        <option value="TIKI REG">TIKI Regular</option>
      </select>
      <textarea name="notes" placeholder="Notes (optional)" />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

### Payment Proof Upload

```tsx
'use client';

import { paymentService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentUpload({ orderId }: { orderId: number }) {
  const { token, user } = useAuth();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !user) return;

    const formData = new FormData(e.currentTarget);
    formData.append('order_id', String(orderId));
    formData.append('partner_id', String(user.id));

    try {
      const response = await paymentService.uploadProof(formData, token);
      if (response.data) {
        alert('Payment proof uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <select name="payment_method" required>
        <option value="TRANSFER">Bank Transfer</option>
        <option value="EWALLET">E-Wallet</option>
      </select>
      <input name="amount" type="number" placeholder="Amount" required />
      <input name="payment_proof" type="file" accept="image/*,.pdf" required />
      <input name="bank_name" placeholder="Bank Name" />
      <input name="account_number" placeholder="Account Number" />
      <input name="account_name" placeholder="Account Name" />
      <textarea name="notes" placeholder="Notes" />
      <button type="submit">Upload Payment Proof</button>
    </form>
  );
}
```

## 🔧 Direct API Client Usage

For more control, use the API client directly:

```tsx
import { api, handleApiError } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api';

async function customRequest() {
  try {
    // GET request
    const response = await api.get(API_ENDPOINTS.MATERIALS.LIST);
    
    // POST request
    const postResponse = await api.post(
      API_ENDPOINTS.CART.ADD,
      { matl_id: 1, qty: 1, price: 100000 },
      'your-token-here'
    );
    
    // File upload
    const formData = new FormData();
    formData.append('file', file);
    const uploadResponse = await api.upload(
      API_ENDPOINTS.PAYMENTS.UPLOAD_PROOF,
      formData,
      'your-token-here'
    );
    
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(errorMessage);
  }
}
```

## 🎯 Best Practices Implemented

1. **Environment Variables**: API URL stored in `.env.local`
2. **Constants**: All endpoints centralized in `lib/api/endpoints.ts`
3. **Type Safety**: Full TypeScript support with comprehensive types
4. **Error Handling**: Centralized error handling with custom `ApiError` class
5. **Token Management**: Secure token storage in localStorage
6. **Service Layer**: Clean separation of API logic
7. **Custom Hooks**: Reusable hooks with automatic refetching
8. **Context**: Global auth state management
9. **Automatic Revalidation**: Smart data refetching on focus/interval

## 📝 Notes

- All authenticated requests automatically include the Bearer token
- Cart hooks automatically refetch on mutations
- Active banners refresh every minute
- Cart count refreshes every 30 seconds
- Error responses are properly typed and handled
- FormData is automatically detected for file uploads

## 🔐 Authentication Flow

1. User logs in via `useAuth().login()`
2. Token and user data stored in localStorage
3. Token automatically included in all authenticated requests
4. On logout, all auth data is cleared

## 🛠️ Extending the API

To add new endpoints:

1. Add endpoint to `lib/api/endpoints.ts`
2. Add types to `types/api.ts`
3. Create service in `lib/api/services/`
4. Create custom hook in `hooks/useApi.ts` (optional)

Example:

```typescript
// 1. Add endpoint
export const API_ENDPOINTS = {
  // ... existing
  WISHLIST: {
    LIST: `${BASE_PATH}/wishlist`,
    ADD: `${BASE_PATH}/wishlist/add`,
  }
};

// 2. Add types
export interface WishlistItem {
  id: number;
  matl_id: number;
  matl_name: string;
}

// 3. Create service
export const wishlistService = {
  getAll: (token: string) =>
    api.get<WishlistItem[]>(API_ENDPOINTS.WISHLIST.LIST, token),
  
  add: (matlId: number, token: string) =>
    api.post(API_ENDPOINTS.WISHLIST.ADD, { matl_id: matlId }, token),
};

// 4. Create hook
export function useWishlist() {
  const { token } = useAuth();
  return useData({
    fetcher: async () => {
      if (!token) return null;
      const response = await wishlistService.getAll(token);
      return response.data;
    },
    deps: [token],
    enabled: !!token,
  });
}
```

## 🚀 Ready to Use!

All API integration is now ready to use in your components. Just import the hooks or services you need and start building!
