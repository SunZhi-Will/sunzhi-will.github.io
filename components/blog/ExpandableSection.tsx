'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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

    // 顏色來自 app/tokens.css，深淺色自動切換
    return (
        <div className="my-6 rounded-xl border transition-all duration-300 border-line bg-surface">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left transition-colors duration-200 hover:bg-surface-raised"
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className="font-medium text-fg">
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDownIcon className="w-5 h-5 text-fg-muted" />
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
                        <div className="px-5 pb-5 text-fg-body">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}












