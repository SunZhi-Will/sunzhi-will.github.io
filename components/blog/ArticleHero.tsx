'use client'

import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { BlogPost } from '@/types/blog';
import type { Lang } from '@/types';
import { blogTranslations, filterTagsByLanguage, translateTag } from '@/lib/blog-translations';
import { formatDate } from '@/lib/blog-utils';

interface ArticleHeroProps {
    readonly post: Omit<BlogPost, 'content'>;
    readonly lang: Lang;
    readonly readingTime: number;
}

const SENTENCE_END = '？！。?!';
const CLAUSE_END = '，：；？！。';
const BRACKETS: Record<string, string> = { '「': '」', '『': '』', '《': '》', '（': '）' };
// 括號內容不超過這個長度才整組不換行，避免手機上撐破版面
const MAX_NOWRAP_LENGTH = 10;

/**
 * 標題若是「一句話＋補充說明」（例如「……就等於抄襲嗎？從……談……」），
 * 拆成主標與副標，讓長標題有層次，而不是一整塊大字。
 */
function splitTitle(title: string): { lead: string; rest: string } {
    for (let i = 0; i < title.length - 1; i++) {
        if (!SENTENCE_END.includes(title[i])) continue;
        const rest = title.slice(i + 1).trim();
        if (rest.length >= 4) {
            return { lead: title.slice(0, i + 1), rest };
        }
        break;
    }
    return { lead: title, rest: '' };
}

/** 依全形標點切成子句，換行時優先斷在子句之間 */
function splitClauses(text: string): string[] {
    const clauses: string[] = [];
    let current = '';
    let closing = '';

    for (const char of text) {
        current += char;
        if (closing) {
            if (char === closing) closing = '';
        } else if (BRACKETS[char]) {
            closing = BRACKETS[char];
        } else if (CLAUSE_END.includes(char)) {
            clauses.push(current);
            current = '';
        }
    }
    if (current) clauses.push(current);
    return clauses;
}

type Segmenter = Intl.Segmenter | null;

/**
 * 中文沒有空格，瀏覽器會在任意兩個字之間換行，標題容易斷成「另一 / 款」「抄 / 襲」。
 * 用 Intl.Segmenter 斷詞後把每個詞包成不換行，換行就只會落在詞與詞之間。
 */
function keepWordsTogether(text: string, segmenter: Segmenter, keyPrefix: string): ReactNode[] {
    if (!segmenter) return [text];

    const tokens: { text: string; word: boolean }[] = [];
    for (const { segment, isWordLike } of segmenter.segment(text)) {
        const previous = tokens[tokens.length - 1];
        // 單字詞（「另一款」的「款」、「抄襲嗎」的「嗎」）併回前一個詞，避免單獨掉到下一行
        if (isWordLike && segment.length === 1 && previous?.word && previous.text.length === 2) {
            previous.text += segment;
        } else {
            tokens.push({ text: segment, word: Boolean(isWordLike) });
        }
    }

    return tokens.map((token, index) =>
        token.word && token.text.length > 1 ? (
            <span key={`${keyPrefix}-${index}`} className="whitespace-nowrap">
                {token.text}
            </span>
        ) : (
            token.text
        ),
    );
}

/** 把「……」《……》這類短括號整組不換行，其餘文字依詞換行 */
function keepPhrasesTogether(clause: string, segmenter: Segmenter): ReactNode[] {
    const nodes: ReactNode[] = [];
    let plain = '';
    const flush = (key: number) => {
        if (plain) nodes.push(...keepWordsTogether(plain, segmenter, `w${key}`));
        plain = '';
    };

    for (let i = 0; i < clause.length; i++) {
        const closing = BRACKETS[clause[i]];
        const end = closing ? clause.indexOf(closing, i + 1) : -1;
        if (end !== -1 && end - i + 1 <= MAX_NOWRAP_LENGTH) {
            flush(i);
            nodes.push(
                <span key={`b${i}`} className="whitespace-nowrap">
                    {clause.slice(i, end + 1)}
                </span>,
            );
            i = end;
        } else {
            plain += clause[i];
        }
    }
    flush(clause.length);
    return nodes;
}

function BalancedText({ text, segmenter }: { readonly text: string; readonly segmenter: Segmenter }) {
    return (
        <>
            {splitClauses(text).map((clause, index) => (
                <span key={index} className="inline-block text-balance">
                    {keepPhrasesTogether(clause, segmenter)}
                </span>
            ))}
        </>
    );
}

/** 進場動畫：沿用 globals.css 的 fade-in-up，依序延遲 */
function reveal(order: number): { className: string; style: CSSProperties } {
    return {
        className: 'animate-fade-in-up motion-reduce:!animate-none',
        style: { animationDelay: `${order * 90}ms`, animationFillMode: 'both' },
    };
}

export function ArticleHero({ post, lang, readingTime }: ArticleHeroProps) {
    const t = blogTranslations[lang];
    const filteredTags = filterTagsByLanguage(post.tags, lang);
    const translatedTags = Array.from(new Set(filteredTags.map(tag => translateTag(tag, lang)))).filter(Boolean);
    const { lead, rest } = splitTitle(post.title);

    // 斷詞結果在 Node 與各瀏覽器間可能不同，所以只在掛載後才啟用，避免 hydration 不一致
    const [segmenter, setSegmenter] = useState<Segmenter>(null);
    useEffect(() => {
        if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
            setSegmenter(new Intl.Segmenter(lang === 'zh-TW' ? 'zh-Hant' : lang, { granularity: 'word' }));
        }
    }, [lang]);

    const meta = reveal(0);
    const title = reveal(1);
    const summary = reveal(2);
    const cover = reveal(3);

    return (
        <header className="relative pt-2 md:pt-6">
            <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted ${meta.className}`}
                style={meta.style}
            >
                <span className="inline-flex items-center gap-2 font-medium text-brand-text">
                    <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-brand" />
                    {formatDate(post.date, lang === 'zh-TW' ? 'zh-TW' : 'en-US')}
                </span>
                <span aria-hidden="true" className="text-fg-muted">/</span>
                <span>
                    {readingTime} {t.readTime}
                </span>
            </div>

            <h1
                className={`mt-5 font-bold tracking-normal text-fg ${title.className}`}
                style={title.style}
            >
                <span className="block text-[1.9rem] leading-[1.28] sm:text-4xl sm:leading-[1.25] md:text-[2.75rem] md:leading-[1.22]">
                    <BalancedText text={lead} segmenter={segmenter} />
                </span>
                {rest && (
                    <span
                        className={`mt-3 block text-xl font-semibold leading-snug sm:text-2xl md:mt-4 md:text-[1.7rem] md:leading-[1.4] text-fg-muted`}
                    >
                        <BalancedText text={rest} segmenter={segmenter} />
                    </span>
                )}
            </h1>

            <div className={summary.className} style={summary.style}>
                <div aria-hidden="true" className="mt-7 h-[3px] w-12 rounded-full bg-brand" />

                {post.description && (
                    <div
                        className={`mt-6 max-w-2xl text-balance text-[17px] font-normal leading-8 md:text-lg md:leading-9 text-fg-body prose-strong:text-fg`}
                        dangerouslySetInnerHTML={{
                            __html: post.descriptionHtml || post.description,
                        }}
                    />
                )}

                {translatedTags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {translatedTags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg-muted"
                            >
                                <span aria-hidden="true" className="text-brand">#</span>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {post.coverImage && (
                <div
                    className={`relative mt-9 aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-surface-sunken shadow-pop ${cover.className}`}
                    style={cover.style}
                >
                    {/* 容器固定 16:9，圖片載入前後版面不會跳；封面是首屏最大的圖，優先載入 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post.coverImageDisplay ?? post.coverImage}
                        alt={post.title}
                        fetchPriority="high"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain"
                    />
                </div>
            )}
        </header>
    );
}
