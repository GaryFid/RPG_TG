/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          900: '#7f1d1d',
        },
        fantasy: {
          gold: '#ffd700',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
          magic: '#8b5cf6',
          fire: '#ef4444',
          water: '#3b82f6',
          earth: '#16a34a',
          air: '#f59e0b',
          'dark-blue': '#1e3a8a',
          'navy': '#1e40af',
          'blue-deep': '#1d4ed8',
          'emerald-dark': '#064e3b',
          'emerald': '#059669',
          'emerald-light': '#10b981',
          'blue-emerald': '#0369a1',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'battle': 'battle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        battle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
