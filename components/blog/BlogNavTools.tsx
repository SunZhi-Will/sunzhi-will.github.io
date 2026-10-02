'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { EASE_OUT } from '@/components/motion/ease';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';
import type { Lang } from '@/types';

interface BlogNavToolsProps {
    lang: Lang;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

// 放在導覽膠囊右端的搜尋與主題切換。搜尋按下後在膠囊內就地展開成輸入框
export function BlogNavTools({ lang, searchQuery, setSearchQuery }: BlogNavToolsProps) {
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = blogTranslations[lang];
    const dark = theme === 'dark';
    const expanded = open || searchQuery.length > 0;

    const button = `flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
        dark ? 'text-zinc-200 hover:text-yellow-400' : 'text-stone-600 hover:text-amber-700'
    }`;

    const close = () => {
        setSearchQuery('');
        setOpen(false);
    };

    return (
        <>
            <AnimatePresence initial={false} mode="popLayout">
                {expanded && (
                    <motion.div
                        key="search-input"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                        className="overflow-hidden"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => !searchQuery && setOpen(false)}
                            onKeyDown={(e) => e.key === 'Escape' && close()}
                            placeholder={t.searchPlaceholder}
                            aria-label={t.searchPlaceholder}
                            className={`h-8 w-[200px] bg-transparent px-3 text-[13px] focus:outline-none ${
                                dark ? 'text-white placeholder:text-zinc-200' : 'text-stone-900 placeholder:text-stone-400'
                            }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => (expanded ? close() : setOpen(true))}
                className={button}
                aria-label={expanded ? (lang === 'zh-TW' ? '關閉搜尋' : 'Close search') : t.searchPlaceholder}
                title={expanded ? (lang === 'zh-TW' ? '關閉搜尋' : 'Close search') : t.searchPlaceholder}
            >
                {expanded ? <XMarkIcon className="h-4 w-4" /> : <MagnifyingGlassIcon className="h-4 w-4" />}
            </button>

            <button
                type="button"
                onClick={toggleTheme}
                className={button}
                aria-label={dark ? '切換為淺色主題' : '切換為深色主題'}
                title={dark ? '切換為淺色主題' : '切換為深色主題'}
            >
                {dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
        </>
    );
}
