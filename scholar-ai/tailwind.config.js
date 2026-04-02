/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
  extend: {
    keyframes: {
      moveGrid: {
        "0%": { transform: "translate(0, 0)" },
        "100%": { transform: "translate(-50px, -50px)" },
      },
    },
    animation: {
      moveGrid: "moveGrid 20s linear infinite",
    },
  },
},
  plugins: [],
}

