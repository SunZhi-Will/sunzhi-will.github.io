'use client'

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SplitText } from '@/components/motion/SplitText';
import { EASE_OUT } from '@/components/motion/ease';

interface SectionHeadingProps {
  index: string;
  title: string;
  aside?: ReactNode;
}

// 區塊標題：編號、逐字升起的標題，以及一條由左往右畫出的細線
export function SectionHeading({ index, title, aside }: SectionHeadingProps) {
  return (
    <header className="mb-12 md:mb-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="eyebrow">{index}</span>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
            <SplitText text={title} />
          </h2>
        </div>
        {aside && <div className="shrink-0 pb-1">{aside}</div>}
      </div>
      <motion.div
        className="mt-8 h-px origin-left bg-white/10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      />
    </header>
  );
}
