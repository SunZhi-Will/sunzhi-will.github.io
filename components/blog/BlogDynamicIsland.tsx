'use client'

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogDynamicIslandProps {
    lang: Lang;
    setLang: (lang: Lang) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function BlogDynamicIsland({
    lang,
    setLang: _setLang, // eslint-disable-line @typescript-eslint/no-unused-vars
    searchQuery,
    setSearchQuery,
}: BlogDynamicIslandProps) {
    const [isFocused, setIsFocused] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const t = blogTranslations[lang];

    const isExpanded = isFocused || searchQuery.length > 0;

    return (
        <div className="fixed top-0 right-0 z-50 pointer-events-auto">
            <div
                className={`relative overflow-hidden mt-4 mr-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-300 ${theme === 'dark'
                    ? 'bg-[#1c1c1e]/95 border border-white/20'
                    : 'bg-[#f0ece4]/92 border border-stone-300/60'
                    }`}
                style={{
                    height: '3rem',
                    minWidth: isExpanded ? '320px' : '140px',
                }}
            >
                <div className="flex items-center gap-2 px-3 h-full">
                    {/* 搜尋框 */}
                    <div className="relative flex-1 min-w-0 h-full flex items-center">
                        <MagnifyingGlassIcon className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10 pointer-events-none ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                            }`} />
                        {isExpanded ? (
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => {
                                    if (!searchQuery) {
                                        setIsFocused(false);
                                    }
                                }}
                                autoFocus
                                className={`w-full pl-8 pr-7 h-full text-xs bg-transparent border-0 
                                     focus:outline-none placeholder-white/30 ${theme === 'dark' ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-400'
                                    }`}
                            />
                        ) : (
                            <button
                                onClick={() => setIsFocused(true)}
                                className={`w-full pl-8 pr-4 h-full text-xs text-left transition-colors ${theme === 'dark'
                                    ? 'text-white/60 hover:text-white'
                                    : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                {t.searchPlaceholder}
                            </button>
                        )}
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsFocused(false);
                                }}
                                className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors z-10 ${theme === 'dark'
                                    ? 'text-white/60 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* 分隔線 */}
                    <div
                        className={`w-px h-5 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
                            }`}
                    />

                    {/* 主題切換按鈕 */}
                    <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${theme === 'dark'
                            ? 'text-white/80 hover:text-yellow-400 hover:bg-white/5'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                            }`}
                        title={theme === 'dark' ? '切換為淺色主題' : '切換為深色主題'}
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-4 h-4" />
                        ) : (
                            <MoonIcon className="w-4 h-4" />
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}

