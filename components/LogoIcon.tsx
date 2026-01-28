'use client'

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "w-6 h-6" }: LogoIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon: Stylized 'S' formed by < and > brackets */}
      <g transform="translate(0, -2)">
        {/* Top Bracket (Top half of S / Opening Tag) */}
        <path
          fill="currentColor"
          d="M 76 20 L 37 20 L 18 39 L 43 49 L 50 42 L 31 36 L 43 28 L 76 28 Z"
        />
        
        {/* Bottom Bracket (Bottom half of S / Closing Tag) */}
        <path
          fill="currentColor"
          d="M 24 82 L 63 82 L 82 63 L 57 53 L 50 60 L 69 66 L 57 74 L 24 74 Z"
        />
      </g>
    </svg>
  );
}
