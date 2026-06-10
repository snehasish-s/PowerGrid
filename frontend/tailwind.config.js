/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#03FFAB",       // Electric green
        secondary: "#F8F5EC",     // Warm off-white
        tertiary: "#8FE7C9",      // Soft mint
        neutral: "#121212",       // Dark canvas
        surface: "#0B0F0D",       // Deep black surface
        "on-surface": "#F8F5EC",  // Content text
        error: "#FF6B6B",         // Alert/destructive
        border: "#374151",        // Divider border
        "text-muted": "#B8B2A6",  // Secondary text
        overlay: "#011210",       // Dark teal-black overlay
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        mono: ["Helvetica Neue", "monospace"],
      },
      letterSpacing: {
        widest: ".08em",
        wider: ".04em",
        wide: ".02em",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'electric-spin': 'electricSpin 1.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(3, 255, 171, 0.2), inset 0 0 5px rgba(3, 255, 171, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(3, 255, 171, 0.6), inset 0 0 10px rgba(3, 255, 171, 0.3)' },
        },
        electricSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
