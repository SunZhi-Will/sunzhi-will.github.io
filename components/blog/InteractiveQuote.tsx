'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

    // 顏色來自 app/tokens.css，深淺色自動切換
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-8 relative bg-gradient-to-br from-surface-raised to-surface rounded-xl border-l-4 border-brand p-6 shadow-lg"
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-brand">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <blockquote className="text-lg leading-relaxed text-fg">
                        &ldquo;{quote}&rdquo;
                    </blockquote>
                    {(author || source) && (
                        <div className="mt-4 text-sm text-fg-muted">
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
                            className="mt-4 text-sm font-medium flex items-center gap-2 text-brand-text hover:text-fg"
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
                            className="mt-4 pt-4 border-t border-line"
                        >
                            {expandedContent}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}


