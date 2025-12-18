'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { useMaterials } from '@/hooks/useApi';
import { Material } from '@/types/api';
import { Filter, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  // Fetch products from API
  const { data, isLoading, error } = useMaterials({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    is_promotion: searchParams.get('filter') === 'promo' ? true : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    per_page: 12,
  });

  const products = data?.data || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.last_page || 1;

  if (error) {
    return (
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-neutral-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          {searchQuery ? (
            <>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                Hasil Pencarian: "{searchQuery}"
              </h1>
              <p className="text-neutral-600">
                {filteredProducts.length} produk ditemukan
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                {filterParam === 'new'
                  ? 'Produk Terbaru'
                  : filterParam === 'discount'
                  ? 'Promo & Diskon'
                  : selectedCategory === 'benang'
                  ? 'Benang & Yarn'
                  : selectedCategory === 'tools'
  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 
             selectedCategory ? selectedCategory : 'Semua Produk'}
          </h1>
          <p className="text-neutral-600">
            {totalProducts} produk ditemukan
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-neutral-900">Filter</h2>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                  Urutkan
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full input"
                >
                  <option value="created_at">Terbaru</option>
                  <option value="price">Harga</option>
                  <option value="name">Nama A-Z</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                  Order
                </h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full input"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">Tidak ada produk ditemukan</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          page === i + 1
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-neutral-400 hover:bg-neutral-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="lg:hidden border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-200 outline-none"
              >
                <option value="popular">Terpopuler</option>
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="name">Nama A-Z</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-neutral-500 text-lg">
                  Tidak ada produk yang ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-10 bg-neutral-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-neutral-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="aspect-square bg-neutral-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
