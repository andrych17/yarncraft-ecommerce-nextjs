'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { useCartBadge } from '@/store/cart';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = useCartBadge();

  const categories = [
    { name: 'Semua Produk', href: '/products' },
    { name: 'Benang', href: '/products?category=benang' },
    { name: 'Alat & Tools', href: '/products?category=tools' },
    { name: 'Promo', href: '/products?filter=discount' },
    { name: 'Terbaru', href: '/products?filter=new' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center py-2 text-sm font-medium">
        🎉 Free Ongkir untuk pembelian di atas Rp 200.000! (Demo Only)
      </div>

      {/* Main navbar */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
              <Image
                src="/logo/TrdRetail1.png"
                alt="KnitAndCro Logo"
                width={40}
                height={40}
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-display font-bold text-primary-600">
                KnitAndCro
              </h1>
              <p className="text-xs text-neutral-500">Craft Your Dreams</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari benang, jarum, atau tools..."
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const searchQuery = (e.target as HTMLInputElement).value;
                    if (searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search button (mobile & tablet) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden text-neutral-600 hover:text-primary-500 transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="text-neutral-600 hover:text-primary-500 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" />
            </Link>

            {/* Account */}
            <Link
              href="/auth/login"
              className="text-neutral-600 hover:text-primary-500 transition-colors"
              aria-label="Account"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-neutral-600 hover:text-primary-500 transition-colors group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-600 hover:text-primary-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center justify-center space-x-8 pb-4 border-t border-neutral-100 pt-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="text-sm font-medium text-neutral-700 hover:text-primary-500 transition-colors relative group"
            >
              {category.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 p-4 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-neutral-200 focus:border-primary-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const searchQuery = (e.target as HTMLInputElement).value;
                  if (searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    setIsSearchOpen(false);
                  }
                }
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 animate-fade-in">
          <div className="container-custom py-4">
            {/* Mobile Categories */}
            <div className="space-y-2 mb-4">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block py-3 px-4 text-neutral-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-around pt-4 border-t border-neutral-200">
              <Link
                href="/wishlist"
                className="flex flex-col items-center text-neutral-600 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-6 h-6" />
                <span className="text-xs mt-1">Wishlist</span>
              </Link>

              <Link
                href="/auth/login"
                className="flex flex-col items-center text-neutral-600 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Akun</span>
              </Link>

              <Link
                href="/cart"
                className="flex flex-col items-center text-neutral-600 hover:text-primary-500 transition-colors relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs mt-1">Keranjang</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
