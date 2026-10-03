'use client'

import { useEffect, useRef, useState } from 'react';
import { Lang } from '@/types';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    lang: Lang;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean) => void;
    onHasHeadings?: (hasHeadings: boolean) => void;
}

export function TableOfContents({
    lang,
    isMobileOpen: controlledIsMobileOpen,
    setIsMobileOpen: controlledSetIsMobileOpen,
    onHasHeadings
}: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const desktopNavRef = useRef<HTMLElement>(null);
    // 桌面版目錄上下還有沒有被藏住的項目，用來決定要不要顯示淡出提示
    const [edges, setEdges] = useState({ top: false, bottom: false });
    const [leftPosition, setLeftPosition] = useState<number>(0);
    const [localIsMobileOpen, setLocalIsMobileOpen] = useState(false);
    
    const isMobileOpen = controlledIsMobileOpen !== undefined ? controlledIsMobileOpen : localIsMobileOpen;
    const setIsMobileOpen = controlledSetIsMobileOpen !== undefined ? controlledSetIsMobileOpen : setLocalIsMobileOpen;

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

    // 觸發 hasHeadings 回呼
    useEffect(() => {
        if (onHasHeadings) {
            onHasHeadings(headings.length > 0);
        }
    }, [headings, onHasHeadings]);

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

        let rafId: number | null = null;

        // 每次都重新量位置：互動元件與圖片載入後版面會變，快取的位置會失準
        const updateActive = () => {
            let active = headingElements[0].id;
            for (const element of headingElements) {
                if (element.getBoundingClientRect().top <= 120) {
                    active = element.id;
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

        updateActive();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [headings]);

    // 目錄上下是否還有內容沒露出來
    useEffect(() => {
        const nav = desktopNavRef.current;
        if (!nav) return;
        const update = () =>
            setEdges({
                top: nav.scrollTop > 4,
                bottom: nav.scrollTop + nav.clientHeight < nav.scrollHeight - 4,
            });
        update();
        nav.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        const observer = new ResizeObserver(update);
        observer.observe(nav);
        if (nav.firstElementChild) observer.observe(nav.firstElementChild);
        return () => {
            nav.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            observer.disconnect();
        };
    }, [headings]);

    // 目前章節換了，就把它捲進目錄的可見範圍，長文讀到後段時目錄不會停在開頭
    useEffect(() => {
        const nav = desktopNavRef.current;
        if (!nav || !activeId) return;
        const link = nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`);
        if (!link) return;
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        if (linkRect.top < navRect.top + 40 || linkRect.bottom > navRect.bottom - 40) {
            nav.scrollTo({
                top: nav.scrollTop + linkRect.top - navRect.top - nav.clientHeight / 2 + linkRect.height / 2,
                behavior: 'smooth',
            });
        }
    }, [activeId]);

    // 處理點擊跳轉
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;

        // 留出浮動導覽列的高度
        const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 96);
        if (window.__lenis) {
            window.__lenis.scrollTo(top);
        } else {
            window.scrollTo({ top, behavior: 'smooth' });
        }
        // 網址帶上錨點，方便直接複製分享這一節
        history.replaceState(null, '', `#${id}`);
        setActiveId(id);
        // 手機點擊後關閉抽屜
        setIsMobileOpen(false);
    };

    if (headings.length === 0) return null;

    const tocLabel = lang === 'zh-TW' ? '目錄' : 'On this page';

    // 每個小節屬於哪一章，以及目前讀到哪一章
    const parentOf = new Map<string, string>();
    let currentChapter = '';
    for (const heading of headings) {
        if (heading.level === 2) currentChapter = heading.id;
        parentOf.set(heading.id, heading.level === 2 ? heading.id : currentChapter);
    }
    const activeChapter = parentOf.get(activeId) ?? '';

    // 桌面版只列出各章，小節等讀到那一章才展開，目錄才不會長到要捲
    const TocList = ({ clamp = false }: { clamp?: boolean }) => (
        <ul className="space-y-0.5">
            {headings
                .filter((heading) => !clamp || heading.level === 2 || parentOf.get(heading.id) === activeChapter)
                .map((heading, index) => {
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
                            className={`block leading-snug transition-all duration-200 ${clamp ? 'py-1 text-xs line-clamp-2' : 'py-3 text-sm'
                                } ${isActive
                                    ? 'text-brand-text font-medium'
                                    : 'text-fg-muted hover:text-brand-text'
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
            {/* 高度 = 視窗高度 - 上方 6rem - 下方 2rem，確保最後一項看得到；
                data-lenis-prevent 讓滾輪在目錄上時捲目錄本身，而不是被平滑捲動拿去捲文章 */}
            <nav
                ref={desktopNavRef}
                data-lenis-prevent
                className={`toc-scroll hidden xl:block fixed top-[6rem] w-44 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pb-4 z-10 transition-all duration-300 ${edges.top ? 'toc-fade-top' : ''} ${edges.bottom ? 'toc-fade-bottom' : ''} text-fg-body`}
                style={{ left: `${leftPosition}px` }}
                aria-label={lang === 'zh-TW' ? '目錄' : 'Table of Contents'}
            >
                <p className="mb-3 text-[11px] font-bold tracking-widest uppercase text-fg-muted">
                    {tocLabel}
                </p>
                <TocList clamp />
            </nav>

            {/* ── 手機／平板版：底部抽屜 ── */}
            <div className="xl:hidden">

                {/* 開啟目錄的浮動按鈕：導覽列收起時也找得到目錄 */}
                {!isMobileOpen && (
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(true)}
                        aria-label={tocLabel}
                        className={`fixed bottom-[5.5rem] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border shadow-pop backdrop-blur-xl transition-colors border-line-strong bg-surface/90 text-brand-text hover:bg-surface-raised`}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                        </svg>
                    </button>
                )}

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
                    <div className="rounded-t-2xl shadow-pop border-t max-h-[70vh] flex flex-col backdrop-blur-2xl bg-surface/95 border-line">
                        {/* 抽屜頭部 */}
                        <div className="flex items-center justify-between px-5 py-2 border-b border-line">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                                </svg>
                                <span className="text-sm font-semibold text-fg">
                                    {tocLabel}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full transition-colors text-fg-muted hover:text-brand-text hover:bg-surface-raised"
                                aria-label={lang === 'zh-TW' ? '關閉目錄' : 'Close'}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屜內容 */}
                        <div data-lenis-prevent className="overflow-y-auto overscroll-contain flex-1 px-5 py-4 scrollbar-hide">
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
