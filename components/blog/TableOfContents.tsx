'use client'

import { useEffect, useState } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';
import { Lang } from '@/types';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    lang: Lang;
}

export function TableOfContents({ lang }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [leftPosition, setLeftPosition] = useState<number>(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 提取文章中的標題
    useEffect(() => {
        const extractHeadings = () => {
            // 只從文章正文內容區域提取標題，排除底部的推薦文章、留言等區塊
            // 第一個 max-w-3xl div 是文章正文，第二個是文章底部
            const articleContent = document.querySelector('[data-article-content="true"]');
            if (!articleContent) return;

            // 只提取 h2-h6，過濾掉文章主標題 h1
            const headingElements = articleContent.querySelectorAll('h2, h3, h4, h5, h6');

            // 過濾掉特定的標題（推薦閱讀、留言、參考資料等）
            const excludedTexts = [
                '推薦閱讀', 'Related Articles',
                '留言', 'Comments',
                '參考資料', 'References',
                '參考來源', 'Reference Sources',
                '分享', 'Share'
            ];
            const extractedHeadings: Heading[] = [];
            const idCounter = new Map<string, number>(); // 追蹤每個 id 的使用次數

            headingElements.forEach((heading, index) => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent || '';

                // 過濾掉特定的標題文字
                if (excludedTexts.some(excluded => text.trim() === excluded)) {
                    return;
                }

                // 如果標題沒有 id，創建一個
                let id = heading.id;
                if (!id || id.trim() === '') {
                    // 從文字生成 id
                    let baseId = text
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();

                    // 如果 id 為空，使用索引作為後備
                    if (!baseId || baseId === '') {
                        baseId = `heading-${index}`;
                    }

                    // 確保 id 唯一：檢查是否已存在
                    const counter = idCounter.get(baseId) || 0;
                    if (counter > 0) {
                        id = `${baseId}-${counter}`;
                    } else {
                        id = baseId;
                    }
                    idCounter.set(baseId, counter + 1);

                    // 確保生成的 id 在 DOM 中唯一
                    let finalId = id;
                    let checkCounter = 0;
                    while (document.getElementById(finalId) && document.getElementById(finalId) !== heading) {
                        checkCounter++;
                        finalId = `${baseId}-${checkCounter}`;
                    }

                    heading.id = finalId;
                    id = finalId;
                } else {
                    // 如果已有 id，也要檢查是否唯一
                    const existingId = id;
                    let checkCounter = 0;
                    while (document.getElementById(id) && document.getElementById(id) !== heading) {
                        checkCounter++;
                        id = `${existingId}-${checkCounter}`;
                    }
                    if (id !== existingId) {
                        heading.id = id;
                    }
                }

                // 最終確保 id 不為空
                if (!id || id.trim() === '') {
                    id = `heading-${index}`;
                    heading.id = id;
                }

                extractedHeadings.push({ id, text, level });
            });

            setHeadings(extractedHeadings);

            // 設置第一個標題為默認活動項
            if (extractedHeadings.length > 0) {
                setActiveId(extractedHeadings[0].id);
            }
        };

        // 延遲執行，確保 DOM 已渲染
        const timer = setTimeout(() => {
            let attempts = 0;
            const tryExtract = () => {
                const articleContent = document.querySelector('[data-article-content="true"]');
                if (articleContent && articleContent.querySelectorAll('h2, h3, h4, h5, h6').length > 0) {
                    extractHeadings();
                } else if (attempts < 5) {
                    attempts++;
                    setTimeout(tryExtract, 100);
                }
            };
            tryExtract();
        }, 300);
        return () => clearTimeout(timer);
    }, [lang]);

    // 計算文章容器的左邊位置，讓目錄貼在文章左邊
    useEffect(() => {
        const calculatePosition = () => {
            const articleContent = document.querySelector('[data-article-content="true"]');
            if (articleContent) {
                const rect = articleContent.getBoundingClientRect();
                // 目錄寬度 224px (w-56)，加上間距 24px
                const calculatedLeft = rect.left - 248;
                // 確保不會太靠左，最小 12px
                setLeftPosition(Math.max(12, calculatedLeft));
            }
        };

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition);

        const articleContent = document.querySelector('[data-article-content="true"]');
        if (articleContent) {
            const resizeObserver = new ResizeObserver(calculatePosition);
            resizeObserver.observe(articleContent);
            return () => {
                window.removeEventListener('resize', calculatePosition);
                window.removeEventListener('scroll', calculatePosition);
                resizeObserver.disconnect();
            };
        }

        return () => {
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition);
        };
    }, []);

    // 監聽滾動，高亮當前章節（純 scroll offset，無 IntersectionObserver，避免閃爍）
    useEffect(() => {
        if (headings.length === 0) return;

        const headingElements = headings
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (headingElements.length === 0) return;

        const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement;
        if (!scrollContainer) return;

        // 預先快取每個標題相對於 scrollContainer 頂部的 offsetTop
        const getOffsets = () =>
            headingElements.map((el) => {
                const rect = el.getBoundingClientRect();
                const cRect = scrollContainer.getBoundingClientRect();
                return rect.top - cRect.top + scrollContainer.scrollTop;
            });

        let offsets = getOffsets();
        let rafId: number | null = null;

        const updateActive = () => {
            const scrollPos = scrollContainer.scrollTop + 100;
            let active = headingElements[0].id;
            for (let i = 0; i < headingElements.length; i++) {
                if (offsets[i] <= scrollPos) {
                    active = headingElements[i].id;
                } else {
                    break;
                }
            }
            setActiveId(active);
        };

        const onScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                updateActive();
                rafId = null;
            });
        };

        // 視窗 resize 時重算 offsets
        const onResize = () => {
            offsets = getOffsets();
            updateActive();
        };

        // 初始化
        updateActive();
        scrollContainer.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [headings]);

    // 處理點擊跳轉
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;

        const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement;
        if (!scrollContainer) return;

        const offset = 120;
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
        const targetPosition = elementTop - offset;

        scrollContainer.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' });
        setActiveId(id);
        // 手機點擊後關閉抽屜
        setIsMobileOpen(false);
    };

    if (headings.length === 0) return null;

    const tocLabel = lang === 'zh-TW' ? '目錄' : 'On this page';

    const TocList = ({ clamp = false }: { clamp?: boolean }) => (
        <ul className="space-y-0.5">
            {headings.map((heading, index) => {
                const isActive = activeId === heading.id;
                const indentClass = {
                    2: 'pl-0',
                    3: 'pl-3',
                    4: 'pl-6',
                    5: 'pl-9',
                    6: 'pl-12',
                }[heading.level] || 'pl-0';

                const uniqueKey = heading.id && heading.id.trim() !== ''
                    ? heading.id
                    : `heading-${index}`;

                return (
                    <li key={uniqueKey} className={indentClass}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(heading.id, e)}
                            className={`block py-1.5 text-xs leading-snug transition-all duration-200 ${clamp ? 'line-clamp-2' : ''
                                } ${isActive
                                    ? isDark
                                        ? 'text-yellow-300 font-medium'
                                        : 'text-yellow-700 font-medium'
                                    : isDark
                                        ? 'text-gray-400 hover:text-gray-200'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {/* ── 桌面版：固定在左側，更長的高度 ── */}
            <nav
                className={`hidden xl:block fixed top-[6rem] w-44 max-h-[calc(100vh-5rem)] overflow-hidden overflow-y-auto z-10 transition-all duration-300 scrollbar-hide ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                style={{ left: `${leftPosition}px` }}
                aria-label={lang === 'zh-TW' ? '目錄' : 'Table of Contents'}
            >
                <p className={`mb-3 text-[11px] font-bold tracking-widest uppercase ${isDark ? 'text-white/30' : 'text-gray-400'
                    }`}>
                    {tocLabel}
                </p>
                <TocList clamp />
            </nav>

            {/* ── 手機／平板版：浮動按鈕 + 底部抽屜 ── */}
            <div className="xl:hidden">
                {/* 浮動目錄按鈕 */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    aria-label={tocLabel}
                    className={`fixed bottom-24 right-4 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-md transition-all duration-300 active:scale-95 ${isDark
                        ? 'bg-gray-800/90 border border-white/15 text-gray-200 hover:bg-gray-700/90'
                        : 'bg-white/90 border border-black/10 text-gray-700 hover:bg-gray-50/90'
                        }`}
                >
                    {/* List / TOC icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                    </svg>
                    <span>{tocLabel}</span>
                </button>

                {/* 遮罩 */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                {/* 底部抽屜 */}
                <div
                    className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >
                    <div className={`rounded-t-2xl shadow-2xl border-t max-h-[70vh] flex flex-col backdrop-blur-2xl ${isDark
                        ? 'bg-gray-900/95 border-white/10'
                        : 'bg-white/95 border-black/10'
                        }`}>
                        {/* 抽屜頭部 */}
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-white/10' : 'border-black/8'
                            }`}>
                            <div className="flex items-center gap-2">
                                <svg className={`w-4 h-4 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                                </svg>
                                <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {tocLabel}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10' : 'text-gray-500 hover:text-gray-800 hover:bg-black/5'
                                    }`}
                                aria-label="Close"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屜內容 */}
                        <div className="overflow-y-auto flex-1 px-5 py-4 scrollbar-hide">
                            <TocList />
                        </div>

                        {/* 底部安全間距 (iOS safe area) */}
                        <div className="h-safe-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
                    </div>
                </div>
            </div>
        </>
    );
}
