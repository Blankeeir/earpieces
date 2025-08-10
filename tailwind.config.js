/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["ui-rounded", "system-ui", "sans-serif"],
        body: ["system-ui", "sans-serif"],
      },
      boxShadow: {
        candy: "0 10px 20px rgba(0,0,0,0.08), 0 6px 6px rgba(0,0,0,0.05)",
      },
      animation: {
        blob: "blob 12s infinite",
        floaty: "floaty 6s ease-in-out infinite"
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 10px) scale(0.97)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        floaty: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" }
        }
      },
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c"
        }
      }
    },
  },
  plugins: [],
}
