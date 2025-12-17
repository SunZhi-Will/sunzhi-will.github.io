'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ShareIcon, 
    LinkIcon, 
    ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';
import { useTheme } from '@/app/blog/ThemeProvider';
import { Lang } from '@/types';

interface ShareButtonsProps {
    title: string;
    url: string;
    lang: Lang;
}

export function ShareButtons({ title, url, lang }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const shareText = lang === 'zh-TW' 
        ? `分享：${title}` 
        : `Share: ${title}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            handleCopy();
        }
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    return (
        <div className={`my-8 p-6 rounded-xl border ${
            isDark
                ? 'border-gray-700/50 bg-gray-800/30'
                : 'border-gray-300/50 bg-gray-50/50'
        }`}>
            <div className={`flex items-center gap-2 mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
                <ShareIcon className="w-5 h-5" />
                <span className="font-medium">
                    {lang === 'zh-TW' ? '分享這篇文章' : 'Share this article'}
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
                <motion.a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                            ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Twitter
                </motion.a>
                <motion.a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                            ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Facebook
                </motion.a>
                <motion.a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                            ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    LinkedIn
                </motion.a>
                <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isDark
                            ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    {copied ? (
                        <>
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                            {lang === 'zh-TW' ? '已複製！' : 'Copied!'}
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-4 h-4" />
                            {lang === 'zh-TW' ? '複製連結' : 'Copy Link'}
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}


