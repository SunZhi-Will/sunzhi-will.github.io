import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';
// 設計 token（app/tokens.css）的 Tailwind 對照。可加透明度的寫成 rgb(var(--x) / <alpha-value>)
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;
const status = (name: string) => ({ DEFAULT: token(name), text: token(`${name}-text`) });
const heading = (level: number, extra: Record<string, string> = {}) =>
  [`var(--font-size-h${level})`, { lineHeight: `var(--line-height-h${level})`, fontWeight: `var(--font-weight-h${level})`, ...extra }] as [string, Record<string, string>];

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
        // 品牌
        brand: { DEFAULT: token('brand'), text: token('brand-text'), on: token('on-brand') },
        // 操作（主要按鈕）
        action: { DEFAULT: token('action'), on: token('on-action') },
        // 表面
        canvas: token('canvas'),
        surface: { DEFAULT: token('surface'), raised: token('surface-raised'), sunken: token('surface-sunken') },
        // 文字
        fg: { DEFAULT: token('fg'), body: token('fg-body'), muted: token('fg-muted') },
        // 線條（本身已是半透明，不支援 /透明度）
        line: { DEFAULT: 'var(--color-line)', strong: 'var(--color-line-strong)' },
        // 狀態
        info: status('info'),
        success: status('success'),
        warning: status('warning'),
        danger: status('danger'),
      },
      fontSize: {
        display: ['var(--font-size-display)', { lineHeight: '1.22', fontWeight: '700' }],
        h1: heading(1, { letterSpacing: 'var(--letter-spacing-h1)' }),
        h2: heading(2, { letterSpacing: 'var(--letter-spacing-h2)' }),
        h3: heading(3, { letterSpacing: 'var(--letter-spacing-h3)' }),
        h4: heading(4),
        h5: heading(5),
        h6: heading(6, { letterSpacing: 'var(--letter-spacing-h6)' }),
        body: ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)' }],
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
        // 設計 token：淺色有陰影，深色的卡片沒有
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
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
