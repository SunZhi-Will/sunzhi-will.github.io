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
    setLang,
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
                    ? 'bg-gray-900/95 border border-gray-700/60'
                    : 'bg-white/90 border border-gray-300/60'
                    }`}
                style={{
                    height: '3rem',
                    minWidth: isExpanded ? '320px' : '140px',
                }}
            >
                <div className="flex items-center gap-2 px-3 h-full">
                    {/* 搜尋框 */}
                    <div className="relative flex-1 min-w-0 h-full flex items-center">
                        <MagnifyingGlassIcon className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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
                                     focus:outline-none placeholder-gray-400 ${theme === 'dark' ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                                    }`}
                            />
                        ) : (
                            <button
                                onClick={() => setIsFocused(true)}
                                className={`w-full pl-8 pr-4 h-full text-xs text-left transition-colors ${theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-500 hover:text-gray-700'
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
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* 分隔線 */}
                    <div
                        className={`w-px h-5 ${theme === 'dark' ? 'bg-gray-600/50' : 'bg-gray-400/50'
                            }`}
                    />

                    {/* 主題切換按鈕 */}
                    <button
                        onClick={toggleTheme}
                        className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${theme === 'dark'
                            ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/70'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                            }`}
                        title={theme === 'dark' ? '切換為淺色主題' : '切換為深色主題'}
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-4 h-4" />
                        ) : (
                            <MoonIcon className="w-4 h-4" />
                        )}
                    </button>

                    {/* 分隔線 */}
                    <div
                        className={`w-px h-5 ${theme === 'dark' ? 'bg-gray-600/50' : 'bg-gray-400/50'
                            }`}
                    />

                    {/* 語言切換按鈕 */}
                    <button
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 whitespace-nowrap flex-shrink-0 ${theme === 'dark'
                                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/70'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/70'
                            }`}
                    >
                        {t.langSwitch}
                    </button>
                </div>
            </div>
        </div>
    );
}

