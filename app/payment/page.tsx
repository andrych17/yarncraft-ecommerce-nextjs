'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Wallet, Banknote, ChevronRight, Copy, Check } from 'lucide-react';
import { formatCurrency } from '@/store/cart';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cod';
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    type: 'bank',
    icon: '🏦',
    description: 'Transfer via BCA Virtual Account',
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    type: 'bank',
    icon: '🏦',
    description: 'Transfer via Mandiri Virtual Account',
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    type: 'bank',
    icon: '🏦',
    description: 'Transfer via BNI Virtual Account',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    type: 'ewallet',
    icon: '💳',
    description: 'Bayar menggunakan GoPay',
  },
  {
    id: 'ovo',
    name: 'OVO',
    type: 'ewallet',
    icon: '💳',
    description: 'Bayar menggunakan OVO',
  },
  {
    id: 'dana',
    name: 'DANA',
    type: 'ewallet',
    icon: '💳',
    description: 'Bayar menggunakan DANA',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    type: 'cod',
    icon: '💵',
    description: 'Bayar saat barang diterima',
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData');
    if (!data) {
      router.push('/cart');
    } else {
      setCheckoutData(JSON.parse(data));
    }
  }, [router]);

  if (!checkoutData) {
    return null;
  }

  const { formData, selectedShipping, subtotal, shippingCost, total } = checkoutData;

  // Generate mock VA number based on selected payment
  const generateVANumber = () => {
    const random = Math.floor(Math.random() * 10000000000);
    return `${random}`.padStart(16, '0');
  };

  const vaNumber = generateVANumber();

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate mock order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Store order data
      sessionStorage.setItem('orderData', JSON.stringify({
        orderId,
        paymentMethod: paymentMethods.find(p => p.id === selectedPayment),
        vaNumber: selectedPayment !== 'cod' ? vaNumber : null,
        total,
        ...checkoutData,
      }));

      router.push('/orders/success');
    }, 2000);
  };

  const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-6">
          <span>Keranjang</span>
          <ChevronRight className="w-4 h-4" />
          <span>Checkout</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-900 font-semibold">Pembayaran</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8">
          Pilih Metode Pembayaran
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            {/* Bank Transfer */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-display font-bold text-neutral-900">
                  Transfer Bank
                </h2>
              </div>
              
              <div className="space-y-3">
                {paymentMethods
                  .filter((method) => method.type === 'bank')
                  .map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{method.icon}</span>
                            <p className="font-semibold text-neutral-900">
                              {method.name}
                            </p>
                          </div>
                          <p className="text-sm text-neutral-600">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            {/* E-Wallet */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="w-6 h-6 text-secondary-600" />
                <h2 className="text-xl font-display font-bold text-neutral-900">
                  E-Wallet
                </h2>
              </div>
              
              <div className="space-y-3">
                {paymentMethods
                  .filter((method) => method.type === 'ewallet')
                  .map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{method.icon}</span>
                            <p className="font-semibold text-neutral-900">
                              {method.name}
                            </p>
                          </div>
                          <p className="text-sm text-neutral-600">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            {/* COD */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Banknote className="w-6 h-6 text-accent-600" />
                <h2 className="text-xl font-display font-bold text-neutral-900">
                  Cash on Delivery
                </h2>
              </div>
              
              <div className="space-y-3">
                {paymentMethods
                  .filter((method) => method.type === 'cod')
                  .map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{method.icon}</span>
                            <p className="font-semibold text-neutral-900">
                              {method.name}
                            </p>
                          </div>
                          <p className="text-sm text-neutral-600">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-6">
                Ringkasan Pembayaran
              </h2>

              {/* Payment Preview */}
              {selectedPaymentMethod && selectedPaymentMethod.type === 'bank' && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-2">
                    Nomor Virtual Account
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-mono font-bold text-neutral-900">
                      {vaNumber}
                    </p>
                    <button
                      onClick={handleCopyVA}
                      className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                      aria-label="Copy VA number"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    *Mock VA Number for demo purposes
                  </p>
                </div>
              )}

              {/* Shipping Address */}
              <div className="mb-6 pb-6 border-b border-neutral-200">
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Alamat Pengiriman
                </p>
                <p className="text-sm text-neutral-900 font-medium">
                  {formData.fullName}
                </p>
                <p className="text-sm text-neutral-600">{formData.phone}</p>
                <p className="text-sm text-neutral-600">
                  {formData.address}, {formData.city}, {formData.province}{' '}
                  {formData.postalCode}
                </p>
              </div>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Ongkir</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-secondary-600">GRATIS</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">
                    Total Pembayaran
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Memproses...
                  </>
                ) : (
                  'Konfirmasi Pembayaran'
                )}
              </button>

              <p className="text-xs text-center text-red-500 mt-4 font-semibold">
                ⚠️ DEMO ONLY - No real payment processed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
