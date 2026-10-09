/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monad: {
          dark: '#080B11',
          card: '#0D111A',
          hover: '#131926',
          border: 'rgba(255, 255, 255, 0.08)',
          purple: '#836EF9',
          purpleLight: '#A78BFA',
          green: '#00F59B',
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
