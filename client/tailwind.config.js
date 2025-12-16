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
          DEFAULT: '#7765DA',
          light: '#5767D0',
          dark: '#4F0DCE',
        },
        neutral: {
          light: '#F2F2F2',
          dark: '#373737',
          gray: '#6E6E6E',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
