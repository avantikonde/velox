/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: '#1F4B5D',
          dark: '#143542',
          light: '#2B6882',
        },
        aqua: {
          DEFAULT: '#68CFEB',
          light: '#90DEF2',
          dark: '#47B6D4',
        },
        softwhite: '#FAFAFA',
        charcoal: {
          DEFAULT: '#1F1E19',
          deep: '#141310',
          card: '#1F1E19',
          surface: '#25241E',
          hover: '#2C2B24',
          border: 'rgba(104, 207, 235, 0.15)',
        },
        monad: {
          dark: '#141310',
          card: '#1F1E19',
          hover: '#25241E',
          border: 'rgba(104, 207, 235, 0.15)',
          purple: '#68CFEB',
          purpleLight: '#90DEF2',
          green: '#68CFEB',
          emerald: '#10B981',
          gold: '#FBBF24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'aurora-flow': 'aurora 8s ease infinite alternate',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
