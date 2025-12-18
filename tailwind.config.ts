import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Craft-themed color palette inspired by yarn and handmade aesthetics
        primary: {
          50: '#fef3f2',
          100: '#fde4e1',
          200: '#fbcdc8',
          300: '#f7aaa2',
          400: '#f17b6d',
          500: '#e55041', // Main primary - warm coral/terracotta
          600: '#d33726',
          700: '#b1291d',
          800: '#92251c',
          900: '#79251e',
        },
        secondary: {
          50: '#f0f9f4',
          100: '#daf0e3',
          200: '#b7e1cb',
          300: '#88cbaa',
          400: '#56af85',
          500: '#389467', // Main secondary - sage green
          600: '#287652',
          700: '#215e43',
          800: '#1d4b36',
          900: '#193e2e',
        },
        accent: {
          50: '#fef7ee',
          100: '#feecd7',
          200: '#fbd5ae',
          300: '#f8b87a',
          400: '#f59244',
          500: '#f27420', // Main accent - warm orange
          600: '#e35a16',
          700: '#bc4214',
          800: '#953518',
          900: '#782e16',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
