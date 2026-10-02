'use client'

import { motion } from 'framer-motion';
import { EASE_OUT, tokenize } from './ease';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  // true：掛載後直接播放（首屏用）；false：進入視窗才播放
  immediate?: boolean;
}

const item = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};

// 文字由遮罩下方逐字升起。完整文字另外留一份給螢幕報讀器，動畫用的碎片對它隱藏
export function SplitText({ text, className, delay = 0, stagger = 0.035, immediate = false }: SplitTextProps) {
  const tokens = tokenize(text);
  const trigger = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } };

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        {...trigger}
      >
        {tokens.map((token, i) =>
          token.isSpace ? (
            <span key={i}> </span>
          ) : (
            <span
              key={i}
              className="inline-block overflow-hidden whitespace-nowrap align-bottom pt-[0.08em] -mt-[0.08em] pb-[0.16em] -mb-[0.16em]"
            >
              <motion.span className="inline-block will-change-transform" variants={item}>
                {token.text}
              </motion.span>
            </span>
          )
        )}
      </motion.span>
    </span>
  );
}
