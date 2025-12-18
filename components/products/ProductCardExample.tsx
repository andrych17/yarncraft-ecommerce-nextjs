/**
 * Example: Product Card Component with Add to Cart
 * Demonstrates best practices for using the API integration
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { handleApiError } from '@/lib/api';
import type { Material } from '@/types/api';

interface ProductCardExampleProps {
  product: Material;
}

export default function ProductCardExample({ product }: ProductCardExampleProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      await addItem(product.id, 1, product.final_price);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      const errorMessage = handleApiError(error);
      alert(`Failed to add to cart: ${errorMessage}`);
    } finally {
      setIsAdding(false);
    }
  };

  const discount = product.is_promotion && product.discount_percentage;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Success Message */}
      {showMessage && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded text-sm z-10">
          Added to cart!
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {product.category && <span>{product.category}</span>}
          {product.brand && (
            <>
              <span>•</span>
              <span>{product.brand}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avg_rating !== undefined && (
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.avg_rating!) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.avg_rating.toFixed(1)}
            </span>
            {product.review_count !== undefined && (
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          {product.is_promotion && product.price !== product.final_price && (
            <div className="text-sm text-gray-500 line-through">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          )}
          <div className="text-xl font-bold text-blue-600">
            Rp {product.final_price.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Color/Size Info */}
        {product.specs && (
          <div className="flex gap-2 text-xs">
            {product.specs.color_name && (
              <div className="flex items-center gap-1">
                {product.specs.color_code && (
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: product.specs.color_code }}
                  />
                )}
                <span>{product.specs.color_name}</span>
              </div>
            )}
            {product.specs.size && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {product.specs.size}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 rounded font-medium transition-colors ${
            isAdding
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
