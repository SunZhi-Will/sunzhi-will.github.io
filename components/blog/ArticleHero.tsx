'use client'

import type { ReactNode } from 'react';
import type { BlogPost } from '@/types/blog';
import type { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage, translateTag } from '@/lib/blog-translations';
import { formatDate } from '@/lib/blog-utils';

interface ArticleHeroProps {
    readonly post: Omit<BlogPost, 'content'>;
    readonly lang: Lang;
    readonly readingTime: number;
    readonly isDark: boolean;
}

function ArticleMetaPill({ children, isDark }: {
    readonly children: ReactNode;
    readonly isDark: boolean;
}) {
    return (
        <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            isDark
                ? 'border-[#3f3f46]/80 bg-[#18181b]/70 text-white/80'
                : 'border-slate-200 bg-white/80 text-slate-600 shadow-sm shadow-slate-200/50'
        }`}>
            {children}
        </span>
    );
}

export function ArticleHero({ post, lang, readingTime, isDark }: ArticleHeroProps) {
    const t = blogTranslations[lang];
    const filteredTags = filterTagsByLanguage(post.tags, lang);
    const translatedTags = Array.from(new Set(filteredTags.map(tag => translateTag(tag, lang)))).filter(Boolean);

    return (
        <header className="relative overflow-hidden rounded-lg border px-5 py-8 sm:px-8 md:px-10 md:py-10" style={{
            borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.12)',
            background: isDark
                ? 'linear-gradient(145deg, rgba(24, 24, 27, 0.94), rgba(39, 39, 42, 0.72))'
                : 'linear-gradient(145deg, rgba(250, 250, 250, 0.96), rgba(255, 255, 255, 0.8))',
            boxShadow: isDark
                ? '0 24px 80px rgba(0, 0, 0, 0.35)'
                : '0 24px 80px rgba(9, 9, 11, 0.09)',
        }}>
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 border-l border-yellow-400/10 bg-yellow-400/[0.03] md:w-24" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full border-t border-amber-400/10 bg-gradient-to-r from-amber-400/[0.06] to-transparent" />

            <div className="relative space-y-7">
                <div className="flex flex-wrap items-center gap-2">
                    <ArticleMetaPill isDark={isDark}>
                        {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                    </ArticleMetaPill>
                    <ArticleMetaPill isDark={isDark}>
                        {readingTime} {t.readTime}
                    </ArticleMetaPill>
                    {translatedTags.map((tag) => (
                        <span
                            key={tag}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                isDark
                                    ? 'bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/15'
                                    : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200/70'
                            }`}
                        >
                                {tag}
                        </span>
                    ))}
                </div>

                <div className="space-y-5">
                    <h1 className={`text-4xl font-bold leading-tight tracking-normal sm:text-5xl md:text-6xl ${
                        isDark ? 'text-slate-50' : 'text-slate-950'
                    }`}>
                        {post.title}
                    </h1>

                    {post.description && (
                        <div
                            className={`max-w-2xl border-l-4 py-1 pl-5 text-lg font-normal leading-8 md:text-xl md:leading-9 ${
                                isDark
                                    ? 'border-yellow-500/60 text-slate-200 prose-strong:text-slate-50'
                                    : 'border-yellow-500/70 text-slate-800 prose-strong:text-slate-950'
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: post.descriptionHtml || post.description,
                            }}
                        />
                    )}
                </div>

                {post.coverImage && (
                    <div className="relative w-full overflow-hidden rounded-2xl border flex justify-center bg-black/5" style={{
                        borderColor: isDark ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.12)',
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto object-contain max-h-[70vh] block"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
