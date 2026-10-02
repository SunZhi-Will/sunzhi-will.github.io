'use client'

import type { HTMLAttributes, PointerEvent } from 'react';

// 滑鼠位置寫進 CSS 變數，由 globals.css 的 .spotlight 畫出跟隨游標的微光
export function Spotlight({ className = '', onPointerMove, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    onPointerMove?.(e);
  };

  return <div className={`spotlight ${className}`} onPointerMove={handleMove} {...rest} />;
}
