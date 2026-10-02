'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { EASE_OUT } from '@/components/motion/ease';
import { scrollToSection } from '@/lib/use-site-lang';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/SunZhi-Will',
    path: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0112 6.84c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.59.69.49A10.26 10.26 0 0022 12.25C22 6.58 17.52 2 12 2z',
    filled: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sunzhi-will',
    path: 'M6.94 8.5H3.56V20h3.38V8.5zM5.25 3a1.97 1.97 0 100 3.94 1.97 1.97 0 000-3.94zM20.44 13.4c0-3.1-1.65-4.9-4.3-4.9-1.4 0-2.4.77-2.8 1.5h-.04V8.5H10.1V20h3.38v-6.1c0-1.6.3-3.15 2.3-3.15 1.97 0 2 1.84 2 3.25V20h3.38l-.02-6.6z',
    filled: true,
  },
  {
    label: 'Email',
    href: 'mailto:sun055676@gmail.com',
    path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    filled: false,
  },
];

const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// 右下角懸浮元件：捲過首屏後浮現。上方按鈕展開社群連結，下方按鈕回到頂端，外圈顯示閱讀進度
export function FloatingDock({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const copy = homeCopy[lang].dock;

  useMotionValueEvent(scrollY, 'change', (value) => {
    const show = value > window.innerHeight * 0.8;
    setVisible(show);
    if (!show) setOpen(false);
  });

  // 點擊元件以外的地方或按 Esc 時收合
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', handlePointer);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const buttonClass =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#141416]/85 text-zinc-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors duration-200 hover:border-white/30 hover:text-white';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={rootRef}
          className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-2.5 md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <AnimatePresence>
            {open &&
              LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={link.label}
                  title={link.label}
                  className={`${buttonClass} h-10 w-10 hover:text-yellow-400`}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE_OUT, delay: (LINKS.length - 1 - i) * 0.05 } }}
                  exit={{ opacity: 0, y: 8, scale: 0.8, transition: { duration: 0.15 } }}
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill={link.filled ? 'currentColor' : 'none'} stroke={link.filled ? 'none' : 'currentColor'} strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.path} />
                  </svg>
                </motion.a>
              ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={copy.social}
            title={copy.social}
            className={buttonClass}
          >
            <motion.svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ rotate: open ? 135 : 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </motion.svg>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('home')}
            aria-label={copy.top}
            title={copy.top}
            className={`${buttonClass} group relative`}
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <motion.circle
                cx="22"
                cy="22"
                r={RING_RADIUS}
                fill="none"
                stroke="#facc15"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                style={{ pathLength: progress }}
              />
            </svg>
            <svg className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
