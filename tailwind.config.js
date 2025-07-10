// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // include .jsx files
    "./public/index.html"              // optional, for CRA or Vite
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '480px', // your custom breakpoint
        'xsm': '570px',
        'llg': '1220px'
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}


