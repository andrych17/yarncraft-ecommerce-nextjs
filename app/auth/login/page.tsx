'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login (mock only)
    setTimeout(() => {
      alert('Login berhasil! (Demo Only - No real authentication)');
      setIsLoading(false);
      window.location.href = '/';
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-neutral-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-lg">
              <Image
                src="/logo/TrdRetail1.png"
                alt="KnitAndCro"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-display font-bold text-primary-600">
              KnitAndCro
            </h1>
          </Link>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-neutral-600">
            Login untuk melanjutkan belanja
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-12"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input pl-12 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Ingat saya</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 inline-block" />
                  Masuk
                </>
              )}
            </button>

            {/* Demo Notice */}
            <div className="mt-4 p-3 bg-accent-50 border border-accent-200 rounded-lg text-center">
              <p className="text-xs text-accent-800">
                ⚠️ Demo Mode - Any email/password will work
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">atau</span>
            </div>
          </div>

          {/* Social Login (Mock) */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => alert('Google login (Demo Only)')}
            >
              <span>🔍</span>
              <span>Lanjutkan dengan Google</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => alert('Facebook login (Demo Only)')}
            >
              <span>📘</span>
              <span>Lanjutkan dengan Facebook</span>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-neutral-600 mt-6">
            Belum punya akun?{' '}
            <Link
              href="/auth/register"
              className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Guest Checkout */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 mb-3">
            Tidak ingin daftar? Tidak masalah!
          </p>
          <Link
            href="/products"
            className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            Lanjutkan sebagai Tamu →
          </Link>
        </div>
      </div>
    </div>
  );
}
