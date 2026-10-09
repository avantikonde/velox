/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitmela: {
          paper: '#F4E7C7',
          'paper-light': '#FAF3E0',
          'paper-dark': '#E8D9B4',
          charcoal: '#17151E',
          'charcoal-light': '#24212D',
          'charcoal-surface': '#1D1A25',
          saffron: '#F2C23A',
          'saffron-light': '#FDE68A',
          scarlet: '#E23A2E',
          'scarlet-dark': '#B7261C',
          cobalt: '#2677C9',
          'cobalt-light': '#4A9BE8',
        },
        aurora: {
          pink: '#F9D4E0',
          lilac: '#EB96FF',
          teal: '#0B5777',
          navy: '#193153',
          dark: '#0e1a2e',
          darker: '#09101c',
          deep: '#060a12',
          card: 'rgba(25, 49, 83, 0.45)',
          border: 'rgba(235, 150, 255, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
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
