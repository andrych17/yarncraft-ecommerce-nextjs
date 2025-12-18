'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Material } from '@/types/api';
import { useCart } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Material;
}

// Helper function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const finalPrice = product.final_price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu');
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem(product.id, 1, finalPrice);
      alert('Produk ditambahkan ke keranjang!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Gagal menambahkan ke keranjang');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card group">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={95}
          priority={false}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="badge badge-discount">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_promotion && (
            <span className="badge badge-new">
              PROMO
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-primary-500 text-white'
              : 'bg-white/90 text-neutral-600 hover:bg-primary-500 hover:text-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-white text-neutral-900 font-medium py-2 rounded-lg hover:bg-primary-500 hover:text-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
          {product.category || product.brand || 'Produk'}
        </p>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avg_rating && product.avg_rating > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.avg_rating!)
                      ? 'fill-accent-400 text-accent-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500">
              ({product.review_count || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(finalPrice)}
          </span>
          {product.is_promotion && product.price !== finalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Brand */}
        {product.brand && (
          <div className="mt-2">
            <span className="badge badge-stock text-xs">
              {product.brand}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
