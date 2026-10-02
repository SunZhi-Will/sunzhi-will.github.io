'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { tokenize } from './ease';

interface ScrollHighlightProps {
  text: string;
  className?: string;
}

function Token({ text, progress, range }: { text: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  return <motion.span style={{ opacity }}>{text}</motion.span>;
}

// 隨捲動逐字由暗轉亮，讓讀者照著閱讀節奏走
export function ScrollHighlight({ text, className }: ScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const tokens = tokenize(text);
  const total = tokens.length;

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, i) =>
        token.isSpace ? (
          ' '
        ) : (
          <Token key={i} text={token.text} progress={scrollYProgress} range={[i / total, Math.min(1, (i + 1) / total)]} />
        )
      )}
    </p>
  );
}
