'use client'

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const GLOW_SIZE = 520;

// 整頁背景：點陣底紋加一道柔光。有滑鼠時柔光跟著游標走，觸控裝置則停在頂端緩慢呼吸
export function Backdrop() {
  const x = useMotionValue(-GLOW_SIZE * 2);
  const y = useMotionValue(-GLOW_SIZE * 2);
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX - GLOW_SIZE / 2);
      y.set(e.clientY - GLOW_SIZE / 2);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [x, y]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="animate-breathe absolute left-[5vw] top-[-30vh] h-[70vh] w-[90vw] rounded-full bg-[radial-gradient(closest-side,rgba(250,204,21,0.07),transparent)]" />
      <motion.div
        className="absolute left-0 top-0 hidden rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.045),transparent)] [@media(pointer:fine)]:block"
        style={{ x: springX, y: springY, width: GLOW_SIZE, height: GLOW_SIZE }}
      />
    </div>
  );
}
