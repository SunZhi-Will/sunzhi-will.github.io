'use client'

import { useState } from 'react';
import { 
    ShareIcon, 
    LinkIcon, 
    ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';
import { Lang } from '@/types';

interface ShareButtonsProps {
    title: string;
    url: string;
    lang: Lang;
}

export function ShareButtons({ title, url, lang }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareText = lang === 'zh-TW' 
        ? `分享：${title}` 
        : `Share: ${title}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch {
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
        <div className="py-3 border-b border-line">
            <div className="flex items-center gap-2 mb-4 text-fg-body">
                <ShareIcon className="w-4 h-4 opacity-60" />
                <span className="text-sm font-normal">
                    {lang === 'zh-TW' ? '分享這篇文章' : 'Share this article'}
                </span>
            </div>
            <div className="flex flex-wrap gap-3">
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 text-sm font-normal rounded-md border transition-all hover:opacity-80 text-fg-muted border-line bg-surface-raised hover:border-line-strong`}
                >
                    Twitter
                </a>
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 text-sm font-normal rounded-md border transition-all hover:opacity-80 text-fg-muted border-line bg-surface-raised hover:border-line-strong`}
                >
                    Facebook
                </a>
                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 text-sm font-normal rounded-md border transition-all hover:opacity-80 text-fg-muted border-line bg-surface-raised hover:border-line-strong`}
                >
                    LinkedIn
                </a>
                <button
                    onClick={handleShare}
                    className={`px-4 py-2 text-sm font-normal rounded-md border transition-all hover:opacity-80 flex items-center gap-2 text-fg-muted border-line bg-surface-raised hover:border-line-strong`}
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
                </button>
            </div>
        </div>
    );
}


