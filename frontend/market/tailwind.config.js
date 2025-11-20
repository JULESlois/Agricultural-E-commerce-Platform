/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B8E7F',
          light: '#8FAA9B',
        },
        accent: {
          red: '#C9897C',
          yellow: '#D4C5A0',
          brown: '#A86D5F',
        },
        neutral: {
          bg: '#F5F3F0',
          border: '#E8E3DA',
        },
      },
    },
  },
  plugins: [],
}
