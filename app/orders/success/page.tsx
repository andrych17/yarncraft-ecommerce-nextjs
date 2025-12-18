'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Copy, Check } from 'lucide-react';
import { formatCurrency, useCartStore } from '@/store/cart';

export default function OrderSuccessPage() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('orderData');
    if (!data) {
      router.push('/');
    } else {
      setOrderData(JSON.parse(data));
      // Clear cart after successful order
      clearCart();
    }
  }, [router, clearCart]);

  if (!orderData) {
    return null;
  }

  const {
    orderId,
    paymentMethod,
    vaNumber,
    total,
    formData,
    selectedShipping,
  } = orderData;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
            <CheckCircle className="w-16 h-16 text-secondary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
            Pesanan Berhasil Dibuat! 🎉
          </h1>
          <p className="text-lg text-neutral-600">
            Terima kasih telah berbelanja di KnitAndCro
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          {/* Order ID */}
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Nomor Pesanan</p>
                <p className="text-xl font-bold text-neutral-900 font-mono">
                  {orderId}
                </p>
              </div>
              <button
                onClick={() => handleCopy(orderId)}
                className="p-3 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Copy order ID"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-secondary-600" />
                ) : (
                  <Copy className="w-5 h-5 text-neutral-600" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Informasi Pembayaran
            </h3>
            
            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{paymentMethod.icon}</span>
                <div>
                  <p className="font-semibold text-neutral-900">
                    {paymentMethod.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {paymentMethod.description}
                  </p>
                </div>
              </div>

              {vaNumber && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-2">
                    Nomor Virtual Account
                  </p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <p className="text-lg font-mono font-bold text-neutral-900">
                      {vaNumber}
                    </p>
                    <button
                      onClick={() => handleCopy(vaNumber)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      aria-label="Copy VA number"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    *Mock VA Number - No real payment required (Demo)
                  </p>
                </div>
              )}

              {paymentMethod.id === 'cod' && (
                <div className="mt-3 p-3 bg-accent-50 border border-accent-200 rounded-lg">
                  <p className="text-sm text-accent-800">
                    Siapkan uang tunai sebesar <strong>{formatCurrency(total)}</strong> saat
                    barang diterima.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-neutral-700">
                Total Pembayaran
              </span>
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-semibold text-neutral-900 mb-3">
              Alamat Pengiriman
            </h3>
            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="font-medium text-neutral-900">{formData.fullName}</p>
              <p className="text-sm text-neutral-600">{formData.phone}</p>
              <p className="text-sm text-neutral-600 mt-2">
                {formData.address}
                <br />
                {formData.city}, {formData.province} {formData.postalCode}
              </p>
              {formData.notes && (
                <p className="text-sm text-neutral-600 mt-2 italic">
                  Catatan: {formData.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 md:p-8 mb-6">
          <h3 className="font-display font-bold text-xl text-neutral-900 mb-4 flex items-center">
            <Package className="w-6 h-6 text-primary-600 mr-2" />
            Langkah Selanjutnya
          </h3>
          
          <ol className="space-y-3 text-neutral-700">
            {vaNumber ? (
              <>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </span>
                  <span>
                    Lakukan pembayaran melalui {paymentMethod.name} dengan VA Number di atas
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </span>
                  <span>
                    Pembayaran akan diverifikasi otomatis (maks. 2 jam)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </span>
                  <span>Pesanan akan segera diproses dan dikirim</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </span>
                  <span>Pesanan akan segera diproses</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </span>
                  <span>
                    Barang akan dikirim dan sampai dalam{' '}
                    {selectedShipping?.estimatedDays || '2-3 hari'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </span>
                  <span>
                    Siapkan uang tunai sebesar {formatCurrency(total)} saat barang tiba
                  </span>
                </li>
              </>
            )}
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                {vaNumber ? '4' : '4'}
              </span>
              <span>Kami akan mengirimkan email konfirmasi & tracking number</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="btn-primary text-center flex-1">
            Kembali ke Beranda
          </Link>
          <Link href="/products" className="btn-outline text-center flex-1">
            Lanjut Belanja
          </Link>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-700 font-semibold">
            ⚠️ DEMO WEBSITE - This is a portfolio project
          </p>
          <p className="text-xs text-red-600 mt-1">
            No real products, payments, or shipments. All data is fictional for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
