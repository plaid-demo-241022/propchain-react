/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#030712', 950: '#020617',
        },
        gold: {
          50: '#FEFDF0', 100: '#FDF9D7', 200: '#FBF0A0', 300: '#F7E263',
          400: '#F0CA2A', 500: '#D4AF37', 600: '#B8941E', 700: '#8B6D12',
          800: '#5C470C', 900: '#2E2306',
        },
        navy: {
          50: '#F0F2F8', 100: '#D8DDF0', 200: '#B0BBE1', 300: '#7A8FCC',
          400: '#4A63B5', 500: '#2D3D8F', 600: '#1F2E72', 700: '#1A1F2E',
          800: '#131720', 900: '#0A0C12',
        },
        indigo: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
        },
        champagne: {
          100: '#fff8e7', 200: '#fcefc7', 300: '#f5e1a0',
          400: '#edcc6e', 500: '#e0b84a',
        },
      },
      fontFamily: {
        outfit: ['Outfit Variable', 'Outfit', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(212,175,55,0.2)',
        glow: '0 0 30px rgba(212,175,55,0.4)',
        'glow-sm': '0 0 15px rgba(212,175,55,0.3)',
        'indigo-glow': '0 0 30px rgba(99,102,241,0.45)',
        premium: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.15)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
        ticker: 'ticker 40s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F0CA2A 50%, #B8941E 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1A1F2E 0%, #1F2E72 50%, #1A1F2E 100%)',
        'gradient-dual': 'linear-gradient(135deg, #D4AF37 0%, #6366f1 100%)',
        'gradient-premium': 'linear-gradient(135deg, #020617 0%, #0f0f2a 50%, #0a0a0e 100%)',
      },
    },
  },
  plugins: [],
};
