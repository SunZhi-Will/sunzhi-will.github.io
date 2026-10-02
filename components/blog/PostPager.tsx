'use client'

import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import type { BlogPost } from '@/types/blog';
import type { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface PostPagerProps {
    /** 同語言的所有文章，新到舊 */
    posts: BlogPost[];
    currentSlug: string;
    lang: Lang;
}

/** 文章結尾的上一篇、下一篇與回列表 */
export function PostPager({ posts, currentSlug, lang }: PostPagerProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const zh = lang === 'zh-TW';

    const index = posts.findIndex((post) => post.slug === currentSlug);
    if (index === -1) return null;

    // 列表是新到舊，所以「下一篇」是比較新的那篇
    const newer = posts[index - 1];
    const older = posts[index + 1];

    const card = `group flex min-h-[5.5rem] flex-col justify-center gap-1.5 rounded-xl border px-4 py-3 transition-colors ${
        isDark
            ? 'border-white/[0.08] bg-white/[0.03] hover:border-yellow-400/40'
            : 'border-stone-200 bg-white hover:border-yellow-500/60'
    }`;
    const label = `inline-flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-zinc-200' : 'text-stone-500'}`;
    const title = `line-clamp-2 text-sm font-semibold leading-snug ${isDark ? 'text-white/90' : 'text-stone-900'}`;

    return (
        <nav aria-label={zh ? '文章導覽' : 'Post navigation'} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
                {older ? (
                    <Link href={`/blog/${older.slug}`} className={card}>
                        <span className={label}>
                            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            {zh ? '上一篇' : 'Previous'}
                        </span>
                        <span className={title}>{older.title}</span>
                    </Link>
                ) : (
                    <span className="hidden sm:block" />
                )}
                {newer && (
                    <Link href={`/blog/${newer.slug}`} className={`${card} sm:items-end sm:text-right`}>
                        <span className={label}>
                            {zh ? '下一篇' : 'Next'}
                            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className={title}>{newer.title}</span>
                    </Link>
                )}
            </div>
            <Link
                href="/blog"
                className={`inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-medium transition-colors ${
                    isDark ? 'text-zinc-200 hover:text-yellow-300' : 'text-stone-600 hover:text-yellow-700'
                }`}
            >
                <Squares2X2Icon className="h-4 w-4" />
                {zh ? '回到所有文章' : 'All posts'}
            </Link>
        </nav>
    );
}
