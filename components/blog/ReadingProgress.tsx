'use client'

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/app/blog/ThemeProvider';

// 頁面頂端的閱讀進度細線。只動 transform，捲動時不會觸發 React 重新渲染
export function ReadingProgress() {
    const { theme } = useTheme();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    return (
        <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5" aria-hidden="true">
            <motion.div
                className={`h-full origin-left ${theme === 'dark' ? 'bg-yellow-400' : 'bg-amber-600'}`}
                style={{ scaleX }}
            />
        </div>
    );
}
