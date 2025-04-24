/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        dark: {
          DEFAULT: '#1F2937',
          lighter: '#374151',
          darker: '#111827',
        },
        gray: {
          DEFAULT: '#9CA3AF',
          light: '#D1D5DB',
          dark: '#4B5563',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
      }
    },
  },
  plugins: [],
} 