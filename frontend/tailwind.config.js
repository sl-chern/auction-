/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          100: '#F7FFF6',
          200: '#F4F4F6',
          300: '#ECEAEA',
          400: '#C2C2C2',
          500: '#D6D6D6'
        },
        dark: {
          100: '#1F1F1F',
          200: '#141414',
          300: '#0A0A0A',
          400: '#292929',
          500: '#111111'
        }
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'openSans': ['Open Sans', 'sans-serif'],
        'roboto': ['Roboto Condensed', 'sans-serif']
      },
      keyframes: {
        ap: {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        op: {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0
          }
        }
      },
      animation: {
        'appearence': 'ap 200ms ease',
        'scale': 'op 260ms ease'
      }
    },
  },
  plugins: [

  ],
}
