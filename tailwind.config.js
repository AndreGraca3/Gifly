/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito Variable", "Nunito", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

