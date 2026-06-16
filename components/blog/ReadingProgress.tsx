'use client'

import { useEffect, useState } from 'react';
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
            <div
                className={`h-full transition-all duration-100 ease-linear ${
                    isDark 
                        ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600' 
                        : 'bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700'
                }`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}












