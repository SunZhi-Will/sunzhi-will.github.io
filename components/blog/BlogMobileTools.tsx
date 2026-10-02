'use client'

import Link from 'next/link';
import { MagnifyingGlassIcon, XMarkIcon, SunIcon, MoonIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';
import type { Lang } from '@/types';

interface BlogMobileToolsProps {
    lang: Lang;
    // 列表頁：搜尋框加主題切換；文章頁：返回加主題切換
    variant: 'list' | 'post';
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

// 手機版頁面頂部的工具列。底部分頁列只負責換頁，
// 搜尋、返回與主題切換放在內容區最上面，跟著頁面捲走，不佔閱讀空間
export function BlogMobileTools({ lang, variant, searchQuery = '', setSearchQuery }: BlogMobileToolsProps) {
    const { theme, toggleTheme } = useTheme();
    const dark = theme === 'dark';
    const t = blogTranslations[lang];
    const zh = lang === 'zh-TW';

    const round = `flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
        dark ? 'border-white/15 text-zinc-200 active:bg-white/10' : 'border-stone-300 text-stone-700 active:bg-stone-100'
    }`;

    return (
        <div className="flex items-center gap-2 md:hidden">
            {variant === 'list' ? (
                <label
                    className={`flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full border px-4 ${
                        dark ? 'border-white/15 bg-white/[0.04]' : 'border-stone-300 bg-white'
                    }`}
                >
                    <MagnifyingGlassIcon className={`h-4 w-4 flex-shrink-0 ${dark ? 'text-zinc-200' : 'text-stone-500'}`} />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        aria-label={t.searchPlaceholder}
                        className={`min-w-0 flex-1 bg-transparent text-sm focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                            dark ? 'text-white placeholder:text-zinc-200' : 'text-stone-900 placeholder:text-stone-400'
                        }`}
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery?.('')} aria-label={zh ? '清除搜尋' : 'Clear search'}>
                            <XMarkIcon className={`h-4 w-4 ${dark ? 'text-zinc-200' : 'text-stone-500'}`} />
                        </button>
                    )}
                </label>
            ) : (
                <Link
                    href="/blog"
                    className={`flex h-11 flex-1 items-center gap-1.5 text-sm font-medium ${dark ? 'text-zinc-200' : 'text-stone-700'}`}
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                    {zh ? '所有文章' : 'All posts'}
                </Link>
            )}

            <button
                type="button"
                onClick={toggleTheme}
                className={round}
                aria-label={dark ? (zh ? '切換為淺色主題' : 'Switch to light theme') : (zh ? '切換為深色主題' : 'Switch to dark theme')}
            >
                {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
        </div>
    );
}
