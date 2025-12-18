# TrdRetail1 E-Commerce API Documentation for Next.js

Base URL: `http://localhost:8000/api/v1/trdretail1`

## Table of Contents
- [Authentication](#authentication)
- [Banner Promotions](#banner-promotions)
- [Materials/Products](#materialsproducts)
- [Shopping Cart](#shopping-cart)
- [Orders](#orders)
- [Payments](#payments)
- [Reviews](#reviews)
- [Shipping](#shipping)

---

## Authentication

### 1. Register Customer

**Endpoint:** `POST /auth/register`

**Description:** Register a new customer account. Returns verification code sent to email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "phone": "08123456789",
  "address": "Jl. Contoh No. 123",
  "city": "Jakarta",
  "postal_code": "12345"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "partner": {
      "id": 1,
      "code": "CUST001",
      "name": "JOHN DOE",
      "email": "john@example.com",
      "phone": "08123456789",
      "email_verified_at": null
    },
    "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "email_sent": true
  }
}
```

**Next.js Example:**
```typescript
// app/api/auth/register.ts or pages/api/auth/register.ts
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    password_confirmation: 'SecurePass123',
    phone: '08123456789',
    address: 'Jl. Contoh No. 123',
    city: 'Jakarta',
    postal_code: '12345'
  })
});

const data = await response.json();
```

---

### 2. Verify Email with Code

**Endpoint:** `POST /auth/verify-email`

**Description:** Verify email address using 6-digit code sent to email.

**Request Body:**
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "email_verified_at": "2026-01-19T10:30:00.000000Z"
  }
}
```

**Next.js Example:**
```typescript
const verifyEmail = async (email: string, code: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code })
  });
  
  return await response.json();
};
```

---

### 3. Resend Verification Code

**Endpoint:** `POST /auth/resend-verification`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "email_sent": true
}
```

---

### 4. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "partner": {
      "id": 1,
      "code": "CUST001",
      "name": "JOHN DOE",
      "email": "john@example.com",
      "email_verified_at": "2026-01-19T10:30:00.000000Z"
    },
    "token": "2|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Next.js Example with Cookies:**
```typescript
// Using Next.js API route to set httpOnly cookie
// app/api/auth/login/route.ts
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Set token in httpOnly cookie
    cookies().set('token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
  }
  
  return Response.json(data);
}
```

---

### 5. Google OAuth Login

**Endpoint:** `GET /auth/google`

**Description:** Redirect to Google OAuth (currently disabled, requires Laravel Socialite)

**Note:** Install Laravel Socialite first: `composer require laravel/socialite`

---

### 6. Get Profile

**Endpoint:** `GET /auth/profile`

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "CUST001",
    "name": "JOHN DOE",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Contoh No. 123",
    "city": "Jakarta",
    "postal_code": "12345",
    "email_verified_at": "2026-01-19T10:30:00.000000Z",
    "avatar": null,
    "is_online_shop_customer": true
  }
}
```

**Next.js Server Component Example:**
```typescript
// app/profile/page.tsx
import { cookies } from 'next/headers';

async function getProfile() {
  const token = cookies().get('token')?.value;
  
  const response = await fetch(`${process.env.API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store'
  });
  
  return await response.json();
}

export default async function ProfilePage() {
  const { data } = await getProfile();
  
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

---

### 7. Update Profile

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "08129999999",
  "address": "New Address",
  "city": "Bandung"
}
```

---

### 8. Change Password

**Endpoint:** `PUT /auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "current_password": "OldPass123",
  "password": "NewPass123",
  "password_confirmation": "NewPass123"
}
```

---

### 9. Logout

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

---

## Banner Promotions

### 1. Get All Banners

**Endpoint:** `GET /banners`

**Description:** Get list of banner promotions with pagination and filtering options.

**Query Parameters:**
- `active_only` (boolean, optional) - Filter only active banners
- `per_page` (integer, optional) - Items per page (default: 10)
- `no_pagination` (boolean, optional) - Get all banners without pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Promo Tahun Baru 2026",
      "description": "Diskon hingga 50% untuk produk pilihan! Buruan sebelum kehabisan!",
      "image_url": "http://localhost:8000/storage/banners/new-year-2026.jpg",
      "image_path": "banners/new-year-2026.jpg",
      "start_date": "2026-01-01",
      "end_date": "2026-01-31",
      "is_active": true,
      "is_currently_active": true,
      "display_order": 1,
      "link_url": "/promotions/new-year-2026",
      "materials_count": 5,
      "materials": [
        {
          "id": 1,
          "code": "PROD001",
          "name": "Product Name",
          "price": "100000.00",
          "promotion_price": "75000.00",
          "is_promotion": true,
          "image_path": "materials/prod001.jpg"
        }
      ],
      "created_at": "2026-01-19 14:20:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 5
  }
}
```

**Next.js Example:**
```typescript
// app/banners/page.tsx or pages/banners.tsx
import { useEffect, useState } from 'react';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_currently_active: boolean;
  display_order: number;
  link_url: string;
  materials_count: number;
  materials: Material[];
}

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banners?active_only=true&per_page=10`
        );
        const data = await response.json();
        
        if (data.success) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      {banners.map(banner => (
        <div key={banner.id}>
          <img src={banner.image_url} alt={banner.title} />
          <h2>{banner.title}</h2>
          <p>{banner.description}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 2. Get Active Banners (For Homepage)

**Endpoint:** `GET /banners/active`

**Description:** Get only currently active banners (based on date range and is_active status). Perfect for homepage carousel/slider.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Promo Tahun Baru 2026",
      "description": "Diskon hingga 50% untuk produk pilihan!",
      "image_url": "http://localhost:8000/storage/banners/new-year-2026.jpg",
      "image_path": "banners/new-year-2026.jpg",
      "start_date": "2026-01-01",
      "end_date": "2026-01-31",
      "is_active": true,
      "is_currently_active": true,
      "display_order": 1,
      "link_url": "/promotions/new-year-2026",
      "materials_count": 5,
      "materials": [...]
    }
  ]
}
```

**Next.js Example:**
```typescript
// app/components/HomeBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
}

export default function HomeBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banners/active`
        );
        const data = await response.json();
        
        if (data.success) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error('Error fetching active banners:', error);
      }
    };

    fetchActiveBanners();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {banners.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.link_url}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h2 className="text-white text-3xl font-bold">{banner.title}</h2>
            <p className="text-white/90 mt-2">{banner.description}</p>
          </div>
        </Link>
      ))}
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Get Banner Detail

**Endpoint:** `GET /banners/{id}`

**Description:** Get detailed information about a specific banner including all associated materials/products.

**URL Parameters:**
- `id` (integer, required) - Banner ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Promo Tahun Baru 2026",
    "description": "Diskon hingga 50% untuk produk pilihan! Buruan sebelum kehabisan!",
    "image_url": "http://localhost:8000/storage/banners/new-year-2026.jpg",
    "image_path": "banners/new-year-2026.jpg",
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "is_active": true,
    "is_currently_active": true,
    "display_order": 1,
    "link_url": "/promotions/new-year-2026",
    "materials_count": 5,
    "materials": [
      {
        "id": 1,
        "code": "PROD001",
        "name": "Product Name",
        "price": "100000.00",
        "promotion_price": "75000.00",
        "is_promotion": true,
        "image_path": "materials/prod001.jpg",
        "pivot": {
          "banner_promotion_id": 1,
          "matl_id": 1,
          "display_order": 1
        }
      }
    ],
    "created_at": "2026-01-19 14:20:00"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Banner not found"
}
```

**Next.js Example:**
```typescript
// app/promotions/[id]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

async function getBannerDetail(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`,
    { next: { revalidate: 300 } } // Revalidate every 5 minutes
  );
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return data.success ? data.data : null;
}

export default async function PromotionDetailPage({ params }: Props) {
  const banner = await getBannerDetail(params.id);
  
  if (!banner) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{banner.title}</h1>
      <p className="text-gray-600 mb-2">{banner.description}</p>
      <p className="text-sm text-gray-500 mb-8">
        Valid from {banner.start_date} to {banner.end_date}
      </p>

      <h2 className="text-2xl font-bold mb-4">
        Products in this promotion ({banner.materials_count})
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {banner.materials.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

### 4. Get Banner's Materials

**Endpoint:** `GET /banners/{id}/materials`

**Description:** Get all materials/products associated with a specific banner promotion.

**URL Parameters:**
- `id` (integer, required) - Banner ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "banner": {
      "id": 1,
      "title": "Promo Tahun Baru 2026",
      "description": "Diskon hingga 50% untuk produk pilihan!"
    },
    "materials": [
      {
        "id": 1,
        "code": "PROD001",
        "name": "Product Name",
        "price": "100000.00",
        "promotion_price": "75000.00",
        "is_promotion": true,
        "image_path": "materials/prod001.jpg",
        "pivot": {
          "banner_promotion_id": 1,
          "matl_id": 1,
          "display_order": 1
        }
      }
    ]
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Banner not found"
}
```

**Next.js Example:**
```typescript
// app/api/banners/[id]/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/banners/${params.id}/materials`
    );
    
    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json(
        { error: data.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch banner materials' },
      { status: 500 }
    );
  }
}
```

---

## Materials/Products

### 1. List Materials (with Filtering & Search)

**Endpoint:** `GET /materials`

**Query Parameters:**
```
?category=ELECTRONICS
&brand=SAMSUNG
&search=smartphone
&color=Black
&size=M
&is_promotion=true
&min_price=1000000
&max_price=5000000
&sort_by=price
&sort_order=asc
&per_page=20
&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "code": "MAT001",
        "name": "Samsung Galaxy S24",
        "descr": "Latest Samsung flagship",
        "category": "ELECTRONICS",
        "brand": "SAMSUNG",
        "type_code": "PHONE",
        "is_display": true,
        "is_promotion": true,
        "promotion_price": 4500000,
        "promotion_start_date": "2026-01-01",
        "promotion_end_date": "2026-01-31",
        "specs": {
          "color_name": "Black",
          "color_code": "#000000",
          "size": "6.2 inch",
          "ram": "8GB",
          "storage": "256GB"
        },
        "price": 5000000,
        "final_price": 4500000,
        "discount_percentage": 10,
        "avg_rating": 4.5,
        "review_count": 25,
        "image_url": "/storage/materials/samsung-s24.jpg"
      }
    ],
    "per_page": 20,
    "total": 100,
    "last_page": 5
  }
}
```

**Next.js Example with SWR:**
```typescript
// hooks/useMaterials.ts
import useSWR from 'swr';

interface MaterialFilters {
  category?: string;
  brand?: string;
  search?: string;
  is_promotion?: boolean;
  min_price?: number;
  max_price?: number;
  page?: number;
}

export function useMaterials(filters: MaterialFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });
  
  const { data, error, isLoading } = useSWR(
    `/materials?${params.toString()}`,
    async (url) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
      return await response.json();
    }
  );
  
  return {
    materials: data?.data?.data || [],
    pagination: {
      currentPage: data?.data?.current_page,
      totalPages: data?.data?.last_page,
      total: data?.data?.total
    },
    isLoading,
    error
  };
}
```

**Usage in Component:**
```typescript
// app/products/page.tsx
'use client';

import { useMaterials } from '@/hooks/useMaterials';
import { useState } from 'react';

export default function ProductsPage() {
  const [filters, setFilters] = useState({ page: 1 });
  const { materials, pagination, isLoading } = useMaterials(filters);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {materials.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.final_price.toLocaleString('id-ID')}</p>
          {product.is_promotion && (
            <span>Diskon {product.discount_percentage}%</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

### 2. Get Material Detail

**Endpoint:** `GET /materials/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "MAT001",
    "name": "Samsung Galaxy S24",
    "descr": "Latest Samsung flagship smartphone",
    "category": "ELECTRONICS",
    "brand": "SAMSUNG",
    "specs": {
      "color_name": "Black",
      "color_code": "#000000",
      "size": "6.2 inch",
      "ram": "8GB",
      "storage": "256GB"
    },
    "price": 5000000,
    "final_price": 4500000,
    "discount_percentage": 10,
    "images": [
      "/storage/materials/samsung-s24-1.jpg",
      "/storage/materials/samsung-s24-2.jpg"
    ],
    "avg_rating": 4.5,
    "rating_stats": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    },
    "reviews": {
      "data": [
        {
          "id": 1,
          "rating": 5,
          "review": "Great phone!",
          "customer_name": "John Doe",
          "created_at": "2026-01-15"
        }
      ],
      "current_page": 1,
      "per_page": 10
    }
  }
}
```

---

### 3. Get Promotions

**Endpoint:** `GET /materials/promotions`

**Query Parameters:** Same as List Materials

**Description:** Returns only materials with active promotions

---

### 4. Get Categories

**Endpoint:** `GET /materials/categories`

**Response (200):**
```json
{
  "success": true,
  "data": [
    "ELECTRONICS",
    "FASHION",
    "FOOD",
    "BOOKS"
  ]
}
```

---

### 5. Get Brands

**Endpoint:** `GET /materials/brands`

---

### 6. Get Available Sizes

**Endpoint:** `GET /materials/sizes`

---

### 7. Get Available Colors

**Endpoint:** `GET /materials/colors`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Black",
      "code": "#000000"
    },
    {
      "name": "White",
      "code": "#FFFFFF"
    }
  ]
}
```

---

## Shopping Cart

**Note:** All cart endpoints require authentication

### 1. Get Cart

**Endpoint:** `GET /cart`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cart_id": 1,
    "items": [
      {
        "id": 1,
        "matl_id": 1,
        "matl_code": "MAT001",
        "matl_name": "Samsung Galaxy S24",
        "qty": 2,
        "price": 4500000,
        "discount": 0,
        "subtotal": 9000000,
        "image_url": "/storage/materials/samsung-s24.jpg"
      }
    ],
    "total_items": 2,
    "total_amount": 9000000
  }
}
```

**Next.js Example:**
```typescript
// hooks/useCart.ts
import useSWR, { mutate } from 'swr';

const fetcher = async (url: string, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

export function useCart(token: string) {
  const { data, error, isLoading } = useSWR(
    token ? ['/cart', token] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000 // Refresh every 30s
    }
  );
  
  return {
    cart: data?.data,
    isLoading,
    error,
    mutate: () => mutate(['/cart', token])
  };
}
```

---

### 2. Add Item to Cart

**Endpoint:** `POST /cart/add`

**Authentication:** Required

**Request Body:**
```json
{
  "matl_id": 1,
  "qty": 2,
  "price": 4500000,
  "notes": "Gift wrap please"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart_dtl_id": 1,
    "qty": 2
  }
}
```

**Next.js Example:**
```typescript
// actions/cart.ts
'use server';

import { cookies } from 'next/headers';

export async function addToCart(matlId: number, qty: number, price: number) {
  const token = cookies().get('token')?.value;
  
  const response = await fetch(`${process.env.API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      matl_id: matlId,
      qty,
      price
    })
  });
  
  return await response.json();
}

// Usage in Client Component
'use client';

import { addToCart } from '@/actions/cart';
import { useCart } from '@/hooks/useCart';

export function AddToCartButton({ productId, price }) {
  const { mutate } = useCart();
  
  const handleAddToCart = async () => {
    const result = await addToCart(productId, 1, price);
    if (result.success) {
      mutate(); // Refresh cart
      toast.success('Added to cart!');
    }
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

---

### 3. Update Cart Item

**Endpoint:** `PUT /cart/items/{id}`

**Authentication:** Required

**Request Body:**
```json
{
  "qty": 3
}
```

---

### 4. Remove Cart Item

**Endpoint:** `DELETE /cart/items/{id}`

**Authentication:** Required

---

### 5. Get Cart Item Count

**Endpoint:** `GET /cart/count`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 5
}
```

---

### 6. Clear Cart

**Endpoint:** `DELETE /cart/clear`

**Authentication:** Required

---

## Orders

**Note:** All order endpoints require authentication

### 1. Checkout (Create Order from Cart)

**Endpoint:** `POST /orders/checkout`

**Authentication:** Required

**Request Body:**
```json
{
  "shipping_address": "Jl. Pengiriman No. 456",
  "shipping_city": "Bandung",
  "shipping_postal_code": "40123",
  "shipping_phone": "08129999999",
  "shipping_cost": 25000,
  "shipping_courier": "JNE REG",
  "notes": "Please call before delivery"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order_id": 1,
    "order_no": "ORD-2026-001",
    "total_amount": 9025000,
    "items_count": 2,
    "status": "P"
  }
}
```

**Next.js Example:**
```typescript
// app/checkout/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData) {
  const token = cookies().get('token')?.value;
  
  const response = await fetch(`${process.env.API_URL}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      shipping_address: formData.get('address'),
      shipping_city: formData.get('city'),
      shipping_postal_code: formData.get('postal_code'),
      shipping_phone: formData.get('phone'),
      shipping_cost: Number(formData.get('shipping_cost')),
      shipping_courier: formData.get('courier'),
      notes: formData.get('notes')
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    redirect(`/orders/${data.data.order_id}/payment`);
  }
  
  return data;
}
```

---

### 2. List Orders

**Endpoint:** `GET /orders`

**Authentication:** Required

**Query Parameters:**
```
?status_code=P
&start_date=2026-01-01
&end_date=2026-01-31
&page=1
&per_page=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "order_no": "ORD-2026-001",
        "order_date": "2026-01-19",
        "status_code": "P",
        "status_name": "Pending Payment",
        "total_amount": 9025000,
        "items_count": 2,
        "payment_status": "unpaid"
      }
    ]
  }
}
```

---

### 3. Get Order Detail

**Endpoint:** `GET /orders/{id}`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_no": "ORD-2026-001",
    "order_date": "2026-01-19",
    "status_code": "P",
    "shipping_address": "Jl. Pengiriman No. 456",
    "shipping_city": "Bandung",
    "shipping_cost": 25000,
    "items": [
      {
        "matl_name": "Samsung Galaxy S24",
        "qty": 2,
        "price": 4500000,
        "subtotal": 9000000
      }
    ],
    "subtotal": 9000000,
    "shipping_cost": 25000,
    "total_amount": 9025000,
    "payment": {
      "status": "pending",
      "method": null
    }
  }
}
```

---

### 4. Cancel Order

**Endpoint:** `POST /orders/{id}/cancel`

**Authentication:** Required

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

## Payments

**Note:** Manual payment with proof upload. All endpoints require authentication.

### 1. Get Payment Methods

**Endpoint:** `GET /payments/methods`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "code": "TRANSFER",
      "name": "Bank Transfer",
      "description": "Transfer to our bank account and upload proof",
      "requires_proof": true
    },
    {
      "code": "EWALLET",
      "name": "E-Wallet",
      "description": "Pay via GoPay, OVO, Dana, etc. and upload proof",
      "requires_proof": true
    },
    {
      "code": "CASH",
      "name": "Cash on Delivery",
      "description": "Pay when you receive the order",
      "requires_proof": false
    }
  ]
}
```

---

### 2. Upload Payment Proof

**Endpoint:** `POST /payments`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Form Data:**
```
order_id: 1
partner_id: 1
payment_method: TRANSFER
amount: 9025000
payment_proof: (file - jpg, jpeg, png, pdf max 2MB)
bank_name: BCA
account_number: 1234567890
account_name: JOHN DOE
notes: Transfer via mobile banking
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment proof uploaded successfully. Awaiting admin verification.",
  "data": {
    "payment": {
      "id": 1,
      "tr_id": "PAY-001",
      "payment_method": "TRANSFER",
      "status_code": "P",
      "status_name": "Pending Verification"
    },
    "proof_url": "http://localhost:8000/storage/payment_proofs/payment_1234567890_abc123.jpg"
  }
}
```

**Next.js Example:**
```typescript
// app/orders/[id]/payment/page.tsx
'use client';

import { useState } from 'react';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('order_id', params.id);
    formData.append('partner_id', '1'); // Get from auth context
    
    try {
      const token = localStorage.getItem('token'); // or from cookie
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Payment proof uploaded successfully!');
        // Redirect to order detail
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <select name="payment_method" required>
        <option value="TRANSFER">Bank Transfer</option>
        <option value="EWALLET">E-Wallet</option>
      </select>
      
      <input type="number" name="amount" required />
      
      <input 
        type="file" 
        name="payment_proof" 
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required 
      />
      
      <input type="text" name="bank_name" placeholder="Bank Name" />
      <input type="text" name="account_number" placeholder="Account Number" />
      <input type="text" name="account_name" placeholder="Account Name" />
      
      <textarea name="notes" placeholder="Notes"></textarea>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Payment Proof'}
      </button>
    </form>
  );
}
```

---

### 3. List Payments

**Endpoint:** `GET /payments`

**Authentication:** Required

---

### 4. Get Payment Detail

**Endpoint:** `GET /payments/{id}`

**Authentication:** Required

---

## Reviews

### 1. List Reviews (Public)

**Endpoint:** `GET /reviews`

**Query Parameters:**
```
?matl_id=1
&rating=5
&page=1
&per_page=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "rating": 5,
        "review": "Excellent product!",
        "customer_name": "John Doe",
        "is_approved": true,
        "created_at": "2026-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. Create Review

**Endpoint:** `POST /reviews`

**Authentication:** Required

**Request Body:**
```json
{
  "order_hdr_id": 1,
  "matl_id": 1,
  "rating": 5,
  "review": "Great product! Highly recommended.",
  "images": ["base64_image_1", "base64_image_2"]
}
```

---

### 3. Get Review Statistics

**Endpoint:** `GET /reviews/statistics/{matl_id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "average_rating": 4.5,
    "total_reviews": 25,
    "rating_distribution": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
}
```

---

## Shipping

### 1. Get Provinces

**Endpoint:** `GET /shipping/provinces`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "province_id": "1",
      "province": "Bali"
    },
    {
      "province_id": "2",
      "province": "Bangka Belitung"
    }
  ]
}
```

---

### 2. Get Cities

**Endpoint:** `GET /shipping/cities`

**Query Parameters:**
```
?province_id=9
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "city_id": "153",
      "province_id": "9",
      "province": "Jawa Barat",
      "type": "Kota",
      "city_name": "Bandung",
      "postal_code": "40111"
    }
  ]
}
```

---

### 3. Calculate Shipping Cost

**Endpoint:** `POST /shipping/calculate`

**Authentication:** Required

**Request Body:**
```json
{
  "origin": 153,
  "destination": 39,
  "weight": 1000,
  "courier": "jne"
}
```

**Response (200):**
```json
{
  "success": true,
  "courier": "JNE",
  "code": "jne",
  "costs": [
    {
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 25000,
      "etd": "2-3",
      "note": null
    },
    {
      "service": "YES",
      "description": "Yakin Esok Sampai",
      "cost": 45000,
      "etd": "1-1",
      "note": null
    }
  ]
}
```

**Next.js Example:**
```typescript
// hooks/useShipping.ts
import { useState } from 'react';

export function useShipping() {
  const [loading, setLoading] = useState(false);
  
  const calculateShipping = async (
    origin: number,
    destination: number,
    weight: number,
    courier: string
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ origin, destination, weight, courier })
        }
      );
      
      return await response.json();
    } finally {
      setLoading(false);
    }
  };
  
  return { calculateShipping, loading };
}
```

---

### 4. Calculate Multiple Couriers

**Endpoint:** `POST /shipping/calculate-multiple`

**Authentication:** Required

**Request Body:**
```json
{
  "origin": 153,
  "destination": 39,
  "weight": 1000,
  "couriers": ["jne", "tiki", "pos"]
}
```

---

### 5. Get Cheapest Option

**Endpoint:** `POST /shipping/cheapest`

**Authentication:** Required

**Request Body:**
```json
{
  "origin": 153,
  "destination": 39,
  "weight": 1000,
  "couriers": ["jne", "tiki", "pos"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courier": "POS Indonesia",
    "code": "pos",
    "service": "Paket Kilat Khusus",
    "description": "Paket Kilat Khusus",
    "cost": 18000,
    "etd": "2-4"
  }
}
```

---

## Environment Variables (.env.local for Next.js)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1/trdretail1
API_URL=http://localhost:8000/api/v1/trdretail1

# For server-side only (not exposed to browser)
API_SECRET_KEY=your-secret-key
```

---

## Error Handling

All endpoints follow this error format:

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Next.js Utility Functions

### API Client

```typescript
// lib/api-client.ts
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
  isFormData?: boolean;
};

export async function apiClient(
  endpoint: string,
  options: RequestOptions = {}
) {
  const { method = 'GET', body, token, isFormData = false } = options;
  
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const config: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    config
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}
```

### Auth Context

```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.partner);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.partner));
    } else {
      throw new Error(data.message);
    }
  };
  
  const logout = async () => {
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## Complete Example: Product Listing Page

```typescript
// app/products/page.tsx
'use client';

import { useState } from 'react';
import { useMaterials } from '@/hooks/useMaterials';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    category: '',
    is_promotion: false
  });
  
  const { materials, pagination, isLoading } = useMaterials(filters);
  
  const addToCart = async (productId: number, price: number) => {
    if (!token) {
      alert('Please login first');
      return;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        matl_id: productId,
        qty: 1,
        price
      })
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Added to cart!');
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded"
        />
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.is_promotion}
            onChange={(e) => setFilters({ ...filters, is_promotion: e.target.checked })}
          />
          <span className="ml-2">Promotions Only</span>
        </label>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {materials.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <img 
              src={product.image_url || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            
            <h3 className="font-bold mt-2">{product.name}</h3>
            
            <div className="flex items-center gap-2 mt-2">
              {product.is_promotion && (
                <>
                  <span className="line-through text-gray-500">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    -{product.discount_percentage}%
                  </span>
                </>
              )}
            </div>
            
            <p className="text-xl font-bold text-blue-600 mt-1">
              Rp {product.final_price.toLocaleString('id-ID')}
            </p>
            
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-500">★</span>
              <span>{product.avg_rating}</span>
              <span className="text-gray-500">({product.review_count})</span>
            </div>
            
            <button
              onClick={() => addToCart(product.id, product.final_price)}
              className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setFilters({ ...filters, page })}
            className={`px-4 py-2 rounded ${
              page === filters.page 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Notes

1. **Authentication**: Store token securely. Use httpOnly cookies for production.
2. **File Upload**: Use FormData for payment proof uploads.
3. **Email Verification**: Verify email before full account access.
4. **Google OAuth**: Requires `composer require laravel/socialite` to be installed.
5. **Payment**: Manual payment with proof upload. Admin verification required.
6. **Shipping**: Uses RajaOngkir API (requires API key).
7. **Email**: Uses Resend service (requires API key).

---

## Setup Instructions

1. **Install Laravel packages:**
   ```bash
   composer require laravel/sanctum
   # Optional for Google OAuth
   composer require laravel/socialite
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example.trdretail1 .env
   # Edit .env with your API keys
   ```

3. **Run migrations:**
   ```bash
   php artisan migrate
   ```

4. **Link storage:**
   ```bash
   php artisan storage:link
   ```

5. **Start server:**
   ```bash
   php artisan serve
   ```

---

For more information or support, contact the development team.
