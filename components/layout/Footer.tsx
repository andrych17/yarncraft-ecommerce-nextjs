import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-white font-display text-xl font-bold mb-4">
              KnitAndCro
            </h3>
            <p className="text-sm mb-4">
              Toko online terpercaya untuk benang rajut, benang crochet, dan perlengkapan craft berkualitas tinggi.
            </p>
            <p className="text-xs text-accent-400 font-semibold">
              ⚠️ DEMO WEBSITE - For Portfolio Only
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-400 transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/products?category=benang" className="hover:text-primary-400 transition-colors">
                  Benang
                </Link>
              </li>
              <li>
                <Link href="/products?category=tools" className="hover:text-primary-400 transition-colors">
                  Alat & Tools
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-primary-400 transition-colors">
                  Produk Terbaru
                </Link>
              </li>
              <li>
                <Link href="/products?filter=discount" className="hover:text-primary-400 transition-colors">
                  Promo
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary-400 transition-colors">
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary-400 transition-colors">
                  Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Contoh No. 123, Jakarta (Demo Address)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>+62 812-3456-7890 (Demo)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>hello@knitandcro.com (Demo)</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} KnitAndCro. All rights reserved.</p>
          <p className="text-xs text-neutral-500 mt-2">
            This is a demo/portfolio website. All products, prices, and transactions are fictional.
          </p>
        </div>
      </div>
    </footer>
  );
}
