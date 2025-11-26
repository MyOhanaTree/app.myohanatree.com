import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#F4F7F2",
          100: "#E7ECE3",
          200: "#CDD6C5",
          300: "#AAB89F",
          400: "#7F936F",
          500: "#637954", // base
          600: "#556847",
          700: "#48573C",
          800: "#3A4631",
          900: "#2A3223",
        },
        secondary: {
          50:  "#FFFCF5",
          100: "#FEF8EC",
          200: "#FCF1D8",
          300: "#FAF3DE", // base
          400: "#EADDC3",
          500: "#D8C7A5",
          600: "#BFAE89",
          700: "#9D8C66",
          800: "#786844",
          900: "#4F4429",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        glow: "0 14px 45px rgba(15, 23, 42, 0.18)",
      },
    },
  },
  plugins: [],
};
