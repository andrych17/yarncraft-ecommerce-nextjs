'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useMaterials, usePromotions } from '@/hooks/useApi';

export default function HomePage() {
  const { data: featuredData } = useMaterials({ per_page: 8, page: 1 });
  const { data: promoData } = usePromotions({ per_page: 4, page: 1 });
  
  const featuredProducts = featuredData?.data || [];
  const promoProducts = promoData?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 overflow-hidden">
        <div className="container-custom py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-neutral-700">
                  Demo Portfolio Website
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 leading-tight">
                Craft Your Dreams with{' '}
                <span className="text-primary-500">Premium Yarn</span>
              </h1>
              
              <p className="text-lg text-neutral-600 max-w-xl">
                Temukan koleksi lengkap benang rajut, benang crochet, dan perlengkapan craft berkualitas tinggi untuk mewujudkan karya impianmu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-center">
                  Belanja Sekarang
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </Link>
                <Link href="/products?filter=new" className="btn-outline text-center">
                  Lihat Produk Baru
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl rounded-full"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src="/image/MAT-000063.jpeg"
                      alt="Benang"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="h-32 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src="/image/MAT-000280.jpeg"
                      alt="Tools"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-32 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src="/image/MAT-000065.jpeg"
                      alt="Colorful Yarn"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="h-48 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src="/image/MAT-000068.jpeg"
                      alt="Wool"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Free Ongkir
                </h3>
                <p className="text-sm text-neutral-600">
                  Gratis ongkir untuk pembelian di atas Rp 200.000 (Mock)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Produk Berkualitas
                </h3>
                <p className="text-sm text-neutral-600">
                  100% produk original dengan jaminan kualitas terbaik
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Customer Support
                </h3>
                <p className="text-sm text-neutral-600">
                  Tim support siap membantu 24/7 via chat & WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                Produk Unggulan
              </h2>
              <p className="text-neutral-600">
                Pilihan terbaik dari koleksi kami
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary-500 font-medium hover:text-primary-600 transition-colors flex items-center"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New/Promo Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                Produk Promo
              </h2>
              <p className="text-neutral-600">
                Dapatkan penawaran terbaik hari ini
              </p>
            </div>
            <Link
              href="/products?filter=promo"
              className="text-primary-500 font-medium hover:text-primary-600 transition-colors flex items-center"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoProducts.length > 0 ? (
              promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-neutral-500">
                Tidak ada produk promo saat ini
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories CTA */}
      <section className="py-16 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Jelajahi Kategori
            </h2>
            <p className="text-neutral-300 max-w-2xl mx-auto">
              Temukan produk sesuai kebutuhanmu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link
              href="/products?category=benang"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 md:p-12 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-bold mb-2">
                  Benang & Yarn
                </h3>
                <p className="text-primary-100 mb-4">
                  Cotton, Wool, Acrylic, dan banyak lagi
                </p>
                <span className="inline-flex items-center text-white font-medium">
                  Lihat Koleksi
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
            </Link>

            <Link
              href="/products?category=tools"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 p-8 md:p-12 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-bold mb-2">
                  Alat & Tools
                </h3>
                <p className="text-secondary-100 mb-4">
                  Jarum Rajut, Crochet Hooks, Gunting, dan aksesori
                </p>
                <span className="inline-flex items-center text-white font-medium">
                  Lihat Koleksi
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
