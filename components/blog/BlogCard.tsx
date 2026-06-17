'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';
import { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage, translateTag } from '@/lib/blog-translations';
import { useTheme } from '@/app/blog/ThemeProvider';

interface BlogCardProps {
    post: BlogPost;
    lang: Lang;
    index: number;
    layout?: 'horizontal' | 'vertical';
    featured?: boolean;
}

export function BlogCard({ post, lang, index, layout = 'horizontal', featured = false }: BlogCardProps) {
    const t = blogTranslations[lang];
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isHorizontal = layout === 'horizontal';

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className={`relative overflow-hidden rounded-2xl h-full
                    transition-all duration-300 ease-out
                    hover:-translate-y-1
                    ${isDark
                        ? 'bg-[#111111] border border-white/[0.06] hover:border-yellow-500/30 shadow-[0_1px_3px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(250,204,21,0.12)]'
                        : 'bg-white border border-black/[0.06] hover:border-amber-400/40 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(251,191,36,0.15)]'
                    }
                `}>

                    {/* Hover glow overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                        ${isDark
                            ? 'bg-gradient-to-br from-yellow-500/[0.04] via-transparent to-transparent'
                            : 'bg-gradient-to-br from-amber-50/80 via-transparent to-transparent'
                        }
                    `} />

                    <div className={`relative flex gap-0
                        ${isHorizontal ? 'flex-col md:flex-row' : 'flex-col'}
                    `}>

                        {/* Cover image */}
                        <div className={`relative flex-shrink-0 overflow-hidden
                            ${isHorizontal
                                ? featured
                                    ? 'w-full md:w-[280px] lg:w-[340px] md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl'
                                    : 'w-full md:w-[200px] lg:w-[240px] md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl'
                                : 'w-full rounded-t-2xl'
                            }
                        `}>
                            <div className={`relative w-full overflow-hidden
                                ${isHorizontal ? 'h-full min-h-[160px] md:min-h-[180px]' : 'aspect-[16/9]'}
                                ${isDark ? 'bg-[#1a1a1a]' : 'bg-stone-50'}
                            `}>
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                        sizes={featured
                                            ? "(max-width: 768px) 100vw, (max-width: 1024px) 340px, 400px"
                                            : isHorizontal
                                                ? "(max-width: 768px) 100vw, (max-width: 1024px) 240px, 280px"
                                                : "(max-width: 768px) 100vw, 50vw"
                                        }
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className={`w-8 h-8 ${isDark ? 'text-white/20' : 'text-stone-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Image gradient shimmer on hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                    ${isDark
                                        ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent'
                                        : 'bg-gradient-to-t from-amber-500/10 via-transparent to-transparent'
                                    }
                                `} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`flex flex-col flex-1 min-w-0 justify-center
                            ${featured ? 'p-6 md:p-7 space-y-3.5' : 'p-5 md:p-6 space-y-2.5'}
                        `}>

                            {/* Meta: Date + Tags */}
                            <div className={`flex items-center flex-wrap gap-2 ${isDark ? 'text-white/35' : 'text-stone-400'}`}>
                                <time className="flex items-center gap-1.5 text-xs whitespace-nowrap font-medium">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                                </time>

                                {(() => {
                                    const filteredTags = filterTagsByLanguage(post.tags, lang);
                                    const translatedTags = Array.from(new Set(filteredTags.map(tag => translateTag(tag, lang)))).filter(Boolean);
                                    return translatedTags.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`w-0.5 h-3 rounded-full ${isDark ? 'bg-white/15' : 'bg-stone-200'}`} />
                                            {translatedTags.slice(0, 2).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide transition-all duration-200
                                                        ${isDark
                                                            ? 'bg-white/[0.06] text-white/50 group-hover:bg-yellow-400/15 group-hover:text-yellow-300/90'
                                                            : 'bg-stone-100 text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-700'
                                                        }
                                                    `}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Title */}
                            <h2 className={`font-bold leading-snug line-clamp-2 relative
                                ${featured ? 'text-xl md:text-2xl lg:text-[1.65rem]' : 'text-base md:text-lg lg:text-xl'}
                                ${isDark ? 'text-white/90' : 'text-stone-900'}
                            `}>
                                <span className="relative z-0 transition-all duration-300">
                                    {post.title}
                                </span>
                                {/* Gradient title on hover */}
                                <span className={`absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                    bg-clip-text text-transparent bg-gradient-to-r
                                    ${isDark
                                        ? 'from-white/95 via-yellow-200 to-white/95'
                                        : 'from-stone-900 via-amber-600 to-stone-800'
                                    }
                                `} style={{ willChange: 'opacity' }}>
                                    {post.title}
                                </span>
                            </h2>

                            {/* Description */}
                            <p className={`leading-relaxed
                                ${featured
                                    ? 'text-sm md:text-[0.9375rem] line-clamp-3'
                                    : 'text-sm line-clamp-2'
                                }
                                ${isDark ? 'text-white/45' : 'text-stone-500'}
                            `}>
                                {post.description}
                            </p>

                            {/* Read more CTA */}
                            <div className="flex items-center pt-0.5">
                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200
                                    ${isDark
                                        ? 'text-white/30 group-hover:text-yellow-400'
                                        : 'text-stone-400 group-hover:text-amber-600'
                                    }
                                `}>
                                    {t.readMore}
                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
