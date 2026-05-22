/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#e4f1f9",   // Biru laut sangat terang
          100: "#b8d9f1",  // Biru laut terang
          200: "#8bc2e8",  // Biru laut lembut
          300: "#5eaae0",  // Biru laut cerah
          400: "#3b95d5",  // Biru laut sedikit lebih menonjol
          500: "#0967a3",  // Warna utama biru laut (ditentukan oleh Anda)
          600: "#085f93",  // Biru laut sedikit lebih gelap
          700: "#064e7a",  // Biru laut yang lebih dalam
          800: "#053d61",  // Biru laut sangat gelap
          900: "#032a47",  // Biru laut paling gelap
        },
      },
    },
  },
  plugins: [],
};
