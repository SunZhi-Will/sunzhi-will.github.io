import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#FDB813",
          light: "#FFE5B4",
          dark: "#FF9D00"
        },
        text: {
          DEFAULT: "#333333",
          light: "#FFFFFF"
        },
        bg: {
          DEFAULT: "#FFFFFF",
          secondary: "#FAFAF5",
          accent: "#FFF8E7"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
