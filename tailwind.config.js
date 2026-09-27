/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'primary-blue': '#004AAD',
          'primary-red': '#E00000',
          'sky': '#41A3D8',
          'deep-navy': '#0B2C5D',
          'dark-blue': '#083067',
          'bright-blue': '#1075CF',
          'light-blue': '#C4E0F6',
          'grey-light': '#F0F1F6',
        },
        primary: {
          blue: '#004AAD',
          red: '#E00000',
          sky: '#41A3D8',
          dark: '#0B2C5D',
          navy: '#083067',
          bright: '#1075CF',
          light: '#C4E0F6',
        },
        accent: {
          coral: '#FF6B6B',
          rose: '#E00000',
          sunset: '#FF8A5C',
        },
        neutral: {
          DEFAULT: '#FFFFFF',
          light: '#F0F1F6',
          mid: '#E5E8EF',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        cinematic: ['Playfair Display', 'Manrope', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'pulse-glow-blue': 'pulseGlowBlue 2.5s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'gradient-y': 'gradientY 10s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spinReverse 25s linear infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
        'cinematic-pan': 'cinematicPan 20s ease-in-out infinite',
        'zoom-pulse': 'zoomPulse 12s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'ken-burns': 'kenBurns 18s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-22px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0)' },
          '50%': { transform: 'translateY(18px) translateX(10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(224,0,0,0.3), 0 0 40px rgba(224,0,0,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(224,0,0,0.6), 0 0 80px rgba(224,0,0,0.2)' },
        },
        pulseGlowBlue: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,74,173,0.3), 0 0 40px rgba(0,74,173,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0,74,173,0.6), 0 0 80px rgba(0,74,173,0.2)' },
        },
        gradientX: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        gradientY: {
          '0%, 100%': { 'background-position': '50% 0%' },
          '50%': { 'background-position': '50% 100%' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        cinematicPan: {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
          '25%': { transform: 'scale(1.08) translate(-1%, -1%)' },
          '50%': { transform: 'scale(1.12) translate(1%, 0%)' },
          '75%': { transform: 'scale(1.08) translate(0, 1%)' },
        },
        zoomPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.18) translate(-2%, -3%)' },
        },
      },
    },
  },
  plugins: [],
}
