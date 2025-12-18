'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Truck, CreditCard, ArrowRight, ChevronRight } from 'lucide-react';
import { useCartStore, formatCurrency } from '@/store/cart';

interface ShippingOption {
  id: string;
  name: string;
  service: string;
  price: number;
  estimatedDays: string;
}

const shippingOptions: ShippingOption[] = [
  {
    id: 'jne-reg',
    name: 'JNE',
    service: 'REG',
    price: 15000,
    estimatedDays: '2-3 hari',
  },
  {
    id: 'jne-yes',
    name: 'JNE',
    service: 'YES',
    price: 25000,
    estimatedDays: '1-2 hari',
  },
  {
    id: 'jt-reg',
    name: 'J&T Express',
    service: 'REG',
    price: 12000,
    estimatedDays: '2-4 hari',
  },
  {
    id: 'sicepat-reg',
    name: 'SiCepat',
    service: 'REG',
    price: 13000,
    estimatedDays: '2-3 hari',
  },
  {
    id: 'sicepat-best',
    name: 'SiCepat',
    service: 'BEST',
    price: 20000,
    estimatedDays: '1-2 hari',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const shippingThreshold = 200000;
  const freeShipping = subtotal >= shippingThreshold;
  
  const selectedShippingOption = shippingOptions.find(
    (opt) => opt.id === selectedShipping
  );
  const shippingCost = freeShipping ? 0 : selectedShippingOption?.price || 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    if (!formData.province.trim()) newErrors.province = 'Provinsi wajib diisi';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Kode pos wajib diisi';
    if (!selectedShipping && !freeShipping) {
      newErrors.shipping = 'Pilih metode pengiriman';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Store checkout data in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkoutData', JSON.stringify({
          formData,
          selectedShipping: selectedShippingOption,
          subtotal,
          shippingCost,
          total,
        }));
      }
      
      router.push('/payment');
    } else {
      // Scroll to first error
      if (typeof document !== 'undefined') {
        const firstErrorField = Object.keys(errors)[0];
        document.getElementsByName(firstErrorField)[0]?.focus();
      }
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-6">
          <span>Keranjang</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-900 font-semibold">Checkout</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-400">Pembayaran</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-neutral-900">
                    Alamat Pengiriman
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`input ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`input ${errors.city ? 'border-red-500' : ''}`}
                      placeholder="Kota"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`input ${errors.province ? 'border-red-500' : ''}`}
                      placeholder="Provinsi"
                    />
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`input ${errors.postalCode ? 'border-red-500' : ''}`}
                      placeholder="12345"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="input"
                      placeholder="Catatan untuk penjual atau kurir"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              {!freeShipping && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-secondary-600" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-neutral-900">
                      Metode Pengiriman <span className="text-red-500">*</span>
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedShipping === option.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="font-semibold text-neutral-900">
                              {option.name} - {option.service}
                            </p>
                            <p className="text-sm text-neutral-600">
                              Estimasi: {option.estimatedDays}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            {formatCurrency(option.price)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.shipping && (
                    <p className="text-red-500 text-sm mt-2">{errors.shipping}</p>
                  )}
                </div>
              )}

              {freeShipping && (
                <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-secondary-600" />
                    <div>
                      <p className="font-semibold text-secondary-900">
                        🎉 Selamat! Anda mendapat FREE ONGKIR
                      </p>
                      <p className="text-sm text-secondary-700">
                        Gratis pengiriman untuk belanja di atas Rp 200.000
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-6">
                  Ringkasan Pesanan
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const finalPrice = item.product.discount
                      ? item.product.price - (item.product.price * item.product.discount) / 100
                      : item.product.price;

                    return (
                      <div
                        key={`${item.product.id}-${item.selectedColor}`}
                        className="flex gap-3"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {item.quantity} x {formatCurrency(finalPrice)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Summary */}
                <div className="space-y-3 mb-6 pt-6 border-t border-neutral-200">
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
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full">
                  <CreditCard className="w-5 h-5 mr-2 inline-block" />
                  Lanjut ke Pembayaran
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>

                <p className="text-xs text-center text-neutral-500 mt-4">
                  ⚠️ Demo Only - No real transaction
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
