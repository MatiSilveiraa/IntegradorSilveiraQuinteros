/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4adea8",
        "background-dark": "#12201b",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
    },
  },
  plugins: [],
}