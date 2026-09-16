/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#d9e4ff",
          200: "#bacfff",
          300: "#8eb0ff",
          400: "#5c86ff",
          500: "#3b62f6",
          600: "#2545eb",
          700: "#1d33d8",
          800: "#1e2cb0",
          900: "#1e298a",
          accent: "#8b5cf6", // purple accent per PRD
        },
        dark: {
          950: "#07090e",
          900: "#0b0f19",
          850: "#111726",
          800: "#172033",
          700: "#222f49",
          600: "#334155",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
