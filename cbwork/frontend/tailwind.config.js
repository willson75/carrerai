/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        accent: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        elevated:
          '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -4px rgba(30, 27, 75, 0.12), 0 24px 48px -12px rgba(30, 27, 75, 0.08)',
        'elevated-lg':
          '0 2px 4px rgba(15, 23, 42, 0.06), 0 12px 32px -6px rgba(30, 27, 75, 0.14), 0 32px 64px -16px rgba(30, 27, 75, 0.1)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.15), 0 8px 32px rgba(79, 70, 229, 0.2)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.18), transparent), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(20, 184, 166, 0.12), transparent), radial-gradient(ellipse 40% 30% at 0% 100%, rgba(79, 70, 229, 0.08), transparent)',
        'brand-gradient': 'linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #0D9488 100%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
