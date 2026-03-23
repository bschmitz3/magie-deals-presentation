import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
      colors: {
        page: "#141414",
        surface: "#1C1C1C",
        elevated: "#262626",
        subtle: "#2E2E2E",
        input: "#FFFFFF",
        badge: "#1E1E1E",
        "badge-border": "#3A3A3A",
        "border-subtle": "#2E2E2E",
        "border-input": "#DADADA",
        green: {
          primary: "#4ADE80",
          hover: "#3ECF71",
          pressed: "#34B863",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#999999",
          muted: "#666666",
          "on-input": "#111111",
          "on-green-btn": "#FFFFFF",
          "on-disabled": "#888888",
        },
        "disabled-bg": "#3A3A3A",
        "disabled-text": "#888888",
        "overlay-backdrop": "rgba(0,0,0,0.4)",
      },
    },
  },
} satisfies Config;

