'use client'

import { motion, type HTMLMotionProps } from 'framer-motion';
import { EASE_OUT } from './ease';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport'> {
  delay?: number;
  y?: number;
}

// 進入視窗時淡入上移，只播放一次
export function Reveal({ children, delay = 0, y = 24, transition, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay, ...transition }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
