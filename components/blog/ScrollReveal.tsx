'use client'

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
    className?: string;
}

export function ScrollReveal({ 
    children, 
    delay = 0, 
    direction = 'up',
    className = ''
}: ScrollRevealProps) {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const variants = {
        up: { y: 30, opacity: 0 },
        down: { y: -30, opacity: 0 },
        left: { x: 30, opacity: 0 },
        right: { x: -30, opacity: 0 },
        fade: { opacity: 0 },
    };

    const animate = {
        up: { y: 0, opacity: 1 },
        down: { y: 0, opacity: 1 },
        left: { x: 0, opacity: 1 },
        right: { x: 0, opacity: 1 },
        fade: { opacity: 1 },
    };

    return (
        <motion.div
            ref={ref}
            initial={variants[direction]}
            animate={inView ? animate[direction] : variants[direction]}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

