import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E',
        secondary: '#059669',
        accent: '#10B981',
        nigeria: '#008751'
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.6s ease-in',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}

export default config