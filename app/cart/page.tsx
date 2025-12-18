'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore, formatCurrency } from '@/store/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const subtotal = getTotalPrice();
  const shippingThreshold = 200000;
  const freeShipping = subtotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 15000; // Mock shipping cost
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-screen py-16">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-neutral-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-neutral-600 mb-8">
              Belum ada produk di keranjang Anda. Yuk mulai belanja!
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Mulai Belanja
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8">
          Keranjang Belanja
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const finalPrice = item.product.discount
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;

              return (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                      {item.product.discount && (
                        <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{item.product.discount}%
                        </span>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-semibold text-neutral-900 hover:text-primary-500 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.selectedColor && (
                            <p className="text-sm text-neutral-600 mt-1">
                              Warna: {item.selectedColor}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(finalPrice)}
                          </div>
                          {item.product.discount && (
                            <div className="text-sm text-neutral-400 line-through">
                              {formatCurrency(item.product.price)}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 rounded-lg border-2 border-neutral-300 flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 text-right">
                        <span className="text-sm text-neutral-600">Subtotal: </span>
                        <span className="text-lg font-bold text-neutral-900">
                          {formatCurrency(finalPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-6">
                Ringkasan Belanja
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal ({items.length} produk)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-neutral-700">
                  <span>Ongkir</span>
                  <span className="font-semibold">
                    {freeShipping ? (
                      <span className="text-secondary-600">GRATIS</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>

                {!freeShipping && (
                  <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 text-sm">
                    <p className="text-accent-800">
                      Belanja {formatCurrency(shippingThreshold - subtotal)} lagi
                      untuk <strong>FREE ONGKIR!</strong>
                    </p>
                    <div className="mt-2 w-full bg-accent-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block">
                Lanjut ke Checkout
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/products"
                className="block text-center text-primary-500 font-medium mt-4 hover:text-primary-600 transition-colors"
              >
                Lanjut Belanja
              </Link>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-neutral-200 text-sm text-neutral-600">
                <p className="mb-2">✓ Pembayaran aman & terpercaya</p>
                <p className="mb-2">✓ Produk 100% original</p>
                <p>✓ Gratis ongkir min. Rp 200.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
