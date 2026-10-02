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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ delay: (index % 2) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className={`relative overflow-hidden rounded-2xl h-full transition-colors duration-300
                    ${isDark
                        ? 'bg-[#111113] border border-white/10 hover:border-white/25'
                        : 'bg-white border border-stone-200 hover:border-stone-400'
                    }
                `}>

                    <div className={`relative flex gap-0
                        ${isHorizontal ? 'flex-col md:flex-row' : 'flex-col'}
                    `}>

                        {/* Cover image */}
                        <div className={`relative flex-shrink-0 overflow-hidden
                            ${isHorizontal
                                ? featured
                                    ? 'w-full md:w-[52%] md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl'
                                    : 'w-full md:w-[200px] lg:w-[240px] md:rounded-l-2xl md:rounded-tr-none rounded-t-2xl'
                                : 'w-full rounded-t-2xl'
                            }
                        `}>
                            <div className={`relative w-full overflow-hidden
                                ${isHorizontal ? 'aspect-[16/9] md:aspect-auto md:h-full md:min-h-[200px]' : 'aspect-[16/9]'}
                                ${isDark ? 'bg-[#1a1a1a]' : 'bg-stone-50'}
                            `}>
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImageDisplay ?? post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                                        sizes={featured
                                            ? "(max-width: 768px) 100vw, 450px"
                                            : isHorizontal
                                                ? "(max-width: 768px) 100vw, (max-width: 1024px) 240px, 280px"
                                                : "(max-width: 768px) 100vw, 50vw"
                                        }
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className={`w-8 h-8 ${isDark ? 'text-zinc-200' : 'text-stone-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`flex flex-col flex-1 min-w-0 justify-center
                            ${featured ? 'p-6 md:p-7 space-y-3.5' : 'p-5 md:p-6 space-y-2.5'}
                        `}>

                            {/* Meta: Date + Tags */}
                            <div className={`flex items-center flex-wrap gap-2 ${isDark ? 'text-zinc-200' : 'text-stone-500'}`}>
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
                                                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-colors duration-200
                                                        ${isDark
                                                            ? 'border-white/12 text-zinc-200 group-hover:border-yellow-400/40 group-hover:text-yellow-300'
                                                            : 'border-stone-200 text-stone-600 group-hover:border-amber-400 group-hover:text-amber-700'
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
                            <h2 className={`font-semibold leading-snug transition-colors duration-300
                                ${featured ? 'line-clamp-3 text-xl md:text-[1.4rem]' : 'line-clamp-2 text-base md:text-lg lg:text-xl'}
                                ${isDark ? 'text-white group-hover:text-yellow-300' : 'text-stone-900 group-hover:text-amber-700'}
                            `}>
                                {post.title}
                            </h2>

                            {/* Description */}
                            <p className={`leading-relaxed
                                ${featured
                                    ? 'text-sm md:text-[0.9375rem] line-clamp-3'
                                    : 'text-sm line-clamp-2'
                                }
                                ${isDark ? 'text-zinc-200' : 'text-stone-600'}
                            `}>
                                {post.description}
                            </p>

                            {/* Read more CTA */}
                            <div className="flex items-center pt-0.5">
                                <span className={`inline-flex items-center gap-1.5 font-geist-mono text-xs font-medium tracking-wider uppercase transition-colors duration-200
                                    ${isDark
                                        ? 'text-zinc-200 group-hover:text-yellow-400'
                                        : 'text-stone-500 group-hover:text-amber-700'
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
