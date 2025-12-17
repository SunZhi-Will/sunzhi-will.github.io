'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/app/blog/ThemeProvider';

interface InteractiveQuoteProps {
    quote: string;
    author?: string;
    source?: string;
    expandable?: boolean;
    expandedContent?: React.ReactNode;
}

export function InteractiveQuote({ 
    quote, 
    author, 
    source,
    expandable = false,
    expandedContent 
}: InteractiveQuoteProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`my-8 relative ${
                isDark
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'
                    : 'bg-gradient-to-br from-gray-50 to-white'
            } rounded-xl border-l-4 ${
                isDark ? 'border-purple-500' : 'border-purple-600'
            } p-6 shadow-lg`}
        >
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <blockquote className={`text-lg leading-relaxed ${
                        isDark ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                        "{quote}"
                    </blockquote>
                    {(author || source) && (
                        <div className={`mt-4 text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {author && <span className="font-medium">— {author}</span>}
                            {source && (
                                <span className={author ? 'ml-2' : ''}>
                                    {source}
                                </span>
                            )}
                        </div>
                    )}
                    {expandable && expandedContent && (
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`mt-4 text-sm font-medium flex items-center gap-2 ${
                                isDark 
                                    ? 'text-purple-400 hover:text-purple-300' 
                                    : 'text-purple-600 hover:text-purple-700'
                            }`}
                        >
                            {isExpanded ? (
                                <>
                                    <XMarkIcon className="w-4 h-4" />
                                    收起
                                </>
                            ) : (
                                <>
                                    展開更多
                                </>
                            )}
                        </motion.button>
                    )}
                    {isExpanded && expandedContent && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mt-4 pt-4 border-t ${
                                isDark ? 'border-gray-700' : 'border-gray-300'
                            }`}
                        >
                            {expandedContent}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}


