/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Add this line right here
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}