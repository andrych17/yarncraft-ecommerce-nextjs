'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { useCartStore, formatCurrency } from '@/store/cart';
import ProductCard from '@/components/products/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id);
  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-6">
          <Link href="/" className="hover:text-primary-500 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-500 transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Produk</span>
        </Link>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden mb-4 aspect-square shadow-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                quality={100}
                priority
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                      quality={90}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              {/* Badges */}
              <div className="flex items-center space-x-2 mb-3">
                {product.discount && (
                  <span className="badge badge-discount">
                    HEMAT {product.discount}%
                  </span>
                )}
                {product.isNew && (
                  <span className="badge badge-new">BARU</span>
                )}
                <span className="badge badge-stock">
                  {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
                {product.name}
              </h1>

              {/* Brand & Category */}
              <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
                {product.brand && <span>Brand: <strong>{product.brand}</strong></span>}
                <span>•</span>
                <span className="capitalize">{product.subcategory || product.category}</span>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-accent-400 text-accent-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-neutral-600">
                    {product.rating} ({product.reviewCount} ulasan)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-neutral-200">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-primary-600">
                    {formatCurrency(finalPrice)}
                  </span>
                  {product.discount && (
                    <span className="text-xl text-neutral-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-neutral-700 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              {/* Color Selection (for yarn) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    Pilih Warna
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedColor === color
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-neutral-300 text-neutral-700 hover:border-primary-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Jumlah
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock));
                    }}
                    className="w-20 h-10 text-center border-2 border-neutral-300 rounded-lg font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-neutral-600">
                    Maks. {product.stock}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 inline-block" />
                  Tambah ke Keranjang
                </button>
                <button
                  className="btn-outline"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                  ✓ Produk berhasil ditambahkan ke keranjang!
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Free Ongkir</p>
                    <p className="text-sm font-medium">Min. Rp 200k</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Original</p>
                    <p className="text-sm font-medium">100% Asli</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mb-16">
            <h2 className="text-2xl font-display font-bold mb-6">Spesifikasi</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <span className="text-neutral-600 font-medium">{spec.label}</span>
                  <span className="text-neutral-900 font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
