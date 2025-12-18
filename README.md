# KnitAndCro - Demo E-Commerce Website

🧶 A modern, full-featured demo e-commerce website for selling yarn, knitting, and crochet supplies.

## ⚠️ IMPORTANT - DEMO/PORTFOLIO PROJECT

This is a **DEMO website for portfolio purposes only**. All data, products, payments, and transactions are **MOCK DATA** for demonstration purposes.

- ❌ No real payment processing
- ❌ No real shipping integration
- ❌ No database connections
- ❌ No real user accounts
- ✅ 100% fictional demonstration data

## 🚀 Tech Stack

- **Next.js 15** (Latest, App Router)
- **React 19** (Latest)
- **TypeScript**
- **Tailwind CSS** (Latest)
- **Zustand** (State Management)
- **next-auth** (Mock Authentication)
- **Lucide React** (Icons)

## 🎨 Features

### ✅ Complete E-Commerce Flow
- 🏠 Homepage with featured products
- 🛍️ Product catalog with filtering & sorting
- 🔍 Product detail pages
- 🛒 Shopping cart with localStorage persistence
- 📦 Checkout flow with shipping address
- 💳 Multiple mock payment methods
- ✅ Order success confirmation

### 🎯 Product System
- Mock product data (Benang & Tools)
- Product categories & filters
- Product images from `/image` folder
- Stock tracking (mock)
- Discount pricing
- Product ratings & reviews

### 🛒 Shopping Cart
- Add/remove items
- Quantity controls
- Cart persistence (localStorage)
- Real-time price calculations
- Free shipping threshold

### 📦 Checkout & Shipping
- Shipping address form
- Mock shipping options:
  - JNE (REG, YES)
  - J&T Express
  - SiCepat (REG, BEST)
- Free shipping above Rp 200,000

### 💰 Payment Methods (All Mock)
- Bank Transfer (BCA, Mandiri, BNI)
- E-Wallet (GoPay, OVO, DANA)
- Cash on Delivery (COD)
- Mock Virtual Account numbers

### 🔐 Authentication (UI Only)
- Login page
- Register page
- Guest checkout option
- No real authentication backend

### 🎨 UI/UX Features
- Fully responsive design
- Craft-themed color palette
- Smooth transitions & animations
- Mobile-friendly navigation
- Modern, clean interface
- Skeleton loading states

## 🎨 Color Palette

Custom craft-themed colors inspired by yarn and handmade aesthetics:

- **Primary**: Warm coral/terracotta (#e55041)
- **Secondary**: Sage green (#389467)
- **Accent**: Warm orange (#f27420)
- **Neutral**: Clean grays for backgrounds

## 📁 Project Structure

```
knitandcro/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── orders/                   # Order success
│   ├── payment/                  # Payment selection
│   ├── products/                 # Product pages
│   │   └── [slug]/              # Product detail
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── products/
│       └── ProductCard.tsx
├── data/
│   └── products.ts              # Mock product data
├── store/
│   └── cart.ts                  # Zustand cart store
├── image/                        # Product images
├── logo/                         # Logo files
├── public/                       # Public assets
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd knitandcro
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages & Routes

- `/` - Homepage
- `/products` - Product catalog
- `/products/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout form
- `/payment` - Payment method selection
- `/orders/success` - Order confirmation
- `/auth/login` - Login page (mock)
- `/auth/register` - Register page (mock)

## 🛠️ Key Components

### Zustand Cart Store (`store/cart.ts`)
- Add/remove/update items
- Calculate totals
- localStorage persistence
- TypeScript typed

### Product Data (`data/products.ts`)
- Mock product catalog
- Helper functions for filtering
- TypeScript interfaces

### Components
- **Navbar**: Responsive navigation with cart badge
- **Footer**: Site footer with links
- **ProductCard**: Reusable product card component

## 🎯 Mock Data

### Products
- 5 Benang (Yarn) products
- 8 Tools & Accessories products
- Each with images, prices, descriptions, specs

### Payment Methods
- 3 Bank Transfer options
- 3 E-Wallet options
- 1 COD option

### Shipping Options
- JNE REG (Rp 15,000, 2-3 days)
- JNE YES (Rp 25,000, 1-2 days)
- J&T Express (Rp 12,000, 2-4 days)
- SiCepat REG (Rp 13,000, 2-3 days)
- SiCepat BEST (Rp 20,000, 1-2 days)

## 🎨 Design Philosophy

- **Craft-themed**: Warm, welcoming colors inspired by yarn and handmade goods
- **User-friendly**: Clear CTAs and intuitive navigation
- **Responsive**: Mobile-first design approach
- **Modern**: Clean, contemporary UI with smooth transitions
- **Accessible**: Semantic HTML and ARIA labels

## 📝 Notes for Reviewers

This is a **portfolio demonstration project** showcasing:
- ✅ Full-stack Next.js development skills
- ✅ TypeScript proficiency
- ✅ State management (Zustand)
- ✅ Modern React patterns (Server/Client Components)
- ✅ Responsive UI/UX design
- ✅ E-commerce flow implementation
- ✅ Clean, maintainable code structure

**No real backend, database, or payment processing is implemented.**

## 🚧 Future Enhancements (Not Implemented)

If this were a real project, it would include:
- Real authentication system
- Database integration
- Payment gateway integration
- Real shipping API
- Admin dashboard
- Order tracking
- Email notifications
- Product search functionality
- Reviews & ratings system
- Wishlist functionality

## 📄 License

This is a demo/portfolio project. Feel free to use it as inspiration for your own projects.

## 👤 Author

Created as a portfolio demonstration project.

---

**Remember**: This is a DEMO website. All products, prices, payments, and transactions are fictional and for demonstration purposes only. No real commerce takes place.
