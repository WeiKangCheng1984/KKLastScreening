/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          card: '#252525',
          border: '#333333',
        },
        industrial: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
          'orange-light': '#fb923c',
          red: '#dc2626',
          'red-dark': '#b91c1c',
          amber: '#f59e0b',
          'amber-dark': '#d97706',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'flicker': 'flicker 0.1s ease-in-out',
        'flicker-slow': 'flicker 0.3s ease-in-out',
        'dim': 'dim 0.5s ease-in-out',
        'electric-shimmer': 'electricShimmer 0.1s linear',
        'fade-float': 'fadeFloat 0.5s ease-out',
        'shake-alert': 'shakeAlert 0.3s ease-in-out',
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
        flicker: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.95', filter: 'brightness(0.9)' },
        },
        dim: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(0.85)' },
        },
        electricShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        fadeFloat: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shakeAlert: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}

