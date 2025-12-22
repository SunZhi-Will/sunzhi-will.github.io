'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/blog/ThemeProvider';

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollableHeight = documentHeight - windowHeight;
            const currentProgress = scrollableHeight > 0 
                ? (scrollTop / scrollableHeight) * 100 
                : 0;
            setProgress(Math.min(100, Math.max(0, currentProgress)));
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1">
            <motion.div
                className={`h-full ${
                    isDark 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                }`}
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
            />
        </div>
    );
}








