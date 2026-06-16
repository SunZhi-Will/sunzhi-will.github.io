import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
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
        accent: {
          yellow: "var(--accent-yellow)",
          amber: "var(--accent-amber)",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(161, 161, 170, 0.3)',
        'glow-lg': '0 0 40px rgba(161, 161, 170, 0.4)',
        'glow-silver': '0 0 20px rgba(192, 192, 192, 0.4)',
        'glow-platinum': '0 0 20px rgba(229, 228, 226, 0.3)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.4)',
        'glow-yellow-lg': '0 0 40px rgba(234, 179, 8, 0.5)',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
