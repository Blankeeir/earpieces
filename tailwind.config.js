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
        glow: "0 0 20px rgba(168, 85, 247, 0.4)",
        neon: "0 0 30px rgba(236, 72, 153, 0.6)",
        soft: "0 8px 32px rgba(0, 0, 0, 0.12)",
        float: "0 20px 40px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        blob: "blob 12s infinite",
        floaty: "floaty 6s ease-in-out infinite",
        bounce: "bounce 2s infinite",
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        slideUp: "slideUp 0.6s ease-out",
        slideDown: "slideDown 0.6s ease-out",
        fadeIn: "fadeIn 0.8s ease-out",
        scaleIn: "scaleIn 0.5s ease-out",
        rotate: "rotate 20s linear infinite",
        wave: "wave 2s ease-in-out infinite",
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
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "0.8" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" }
        }
      },
      colors: {
        brand: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d"
        },
        neon: {
          pink: "#ec4899",
          purple: "#a855f7",
          blue: "#3b82f6",
          green: "#10b981",
          yellow: "#f59e0b",
          orange: "#f97316"
        },
        gradient: {
          start: "#ec4899",
          middle: "#a855f7",
          end: "#3b82f6"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(45deg, #ec4899, #a855f7, #3b82f6, #10b981)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
