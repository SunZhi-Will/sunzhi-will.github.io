'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/app/blog/ThemeProvider';

interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    icon?: React.ReactNode;
}

export function ExpandableSection({ 
    title, 
    children, 
    defaultExpanded = false,
    icon 
}: ExpandableSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`my-6 rounded-xl border transition-all duration-300 ${
            isDark
                ? 'border-gray-700/50 bg-gray-800/30'
                : 'border-gray-300/50 bg-gray-50/50'
        }`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full px-5 py-4 flex items-center justify-between gap-3 text-left transition-colors duration-200 ${
                    isDark
                        ? 'hover:bg-gray-800/50'
                        : 'hover:bg-gray-100/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className={`font-medium ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDownIcon className={`w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`px-5 pb-5 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}







