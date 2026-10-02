'use client'

import { useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

interface MarqueeProps {
  children: ReactNode;
  // 每秒移動軌道寬度的百分比，負值代表反向
  speed?: number;
  // 每一半軌道要重複幾次內容，內容太短時調高以免露出空白
  repeat?: number;
  className?: string;
}

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

// 無限跑馬燈：捲動越快跑越快，捲動方向反轉時跟著反轉；滑鼠停留或離開視窗時暫停
export function Marquee({ children, speed = 2, repeat = 2, className = '' }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: '100px 0px' });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || paused || !inView) return;

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    // delta 在分頁切回來時可能很大，限制上限避免跳動
    const step = speed * (Math.min(delta, 64) / 1000);
    baseX.set(baseX.get() - direction.current * step * (1 + Math.abs(factor)));
  });

  // 偏好減少動態時不移動，維持同一個版面，只是靜止的一排
  const half = Array.from({ length: repeat }, (_, i) => (
    <div key={i} className="flex shrink-0 items-center">
      {children}
    </div>
  ));

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        <div className="flex shrink-0">{half}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {half}
        </div>
      </motion.div>
    </div>
  );
}
