import type { Config } from "tailwindcss";

// Design tokens for the app. Kept deliberately small for V1 (a data-dense,
// calm "read-only ledger" look) but structured so future feature modules
// (charts, timelines, dashboards) can extend the palette without collisions.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d10",
          900: "#12151a",
          800: "#1b1f26",
          700: "#262b34",
          600: "#3a4150",
          400: "#7c8493",
          200: "#c7cbd3",
          50: "#f5f6f8",
        },
        signal: {
          mutual: "#4fd1a5",
          lost: "#f2795b",
          gained: "#6ea8fe",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;
