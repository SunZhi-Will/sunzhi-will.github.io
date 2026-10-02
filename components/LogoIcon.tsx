'use client'

interface LogoIconProps {
  className?: string;
}

// 字標：兩個圓弧接成的 S，上端筆畫收成一顆太陽。
// 同一組數值也寫在 scripts/generate-brand-assets.js（favicon 與 OG 圖片），改了要兩邊一起改
export function LogoIcon({ className = "w-6 h-6" }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M55.4 14.8A18 18 0 1 0 50 50A18 18 0 1 1 33.1 74.2"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <circle cx="67.6" cy="28.3" r="7.5" fill="#facc15" />
    </svg>
  );
}
