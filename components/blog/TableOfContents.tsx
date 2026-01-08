'use client'

import { useEffect, useState, useRef } from 'react';
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 提取文章中的標題
    useEffect(() => {
        const extractHeadings = () => {
            // 只從文章正文內容區域提取標題，排除底部的推薦文章、留言等區塊
            // 第一個 max-w-3xl div 是文章正文，第二個是文章底部
            const articleContent = document.querySelector('article > div.max-w-3xl:first-of-type');
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
        const timer = setTimeout(extractHeadings, 100);
        return () => clearTimeout(timer);
    }, []);

    // 計算文章容器的左邊位置，讓目錄貼在文章左邊
    useEffect(() => {
        const calculatePosition = () => {
            const articleContent = document.querySelector('article > div.max-w-3xl');
            if (articleContent) {
                const rect = articleContent.getBoundingClientRect();
                // 目錄寬度 224px (w-56 = 14rem = 224px)，加上間距 16px
                const calculatedLeft = rect.left - 240;
                // 確保不會太靠左，最小距離左邊 16px
                setLeftPosition(Math.max(16, calculatedLeft));
            }
        };

        // 初始計算
        calculatePosition();

        // 監聽窗口大小變化和滾動
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition);

        // 使用 ResizeObserver 監聽文章容器大小變化
        const articleContent = document.querySelector('article > div.max-w-3xl');
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

    // 監聽滾動，高亮當前章節
    useEffect(() => {
        if (headings.length === 0) return;

        const headingElements = headings.map(({ id }) => 
            document.getElementById(id)
        ).filter(Boolean) as HTMLElement[];

        if (headingElements.length === 0) return;

        // 找到滾動容器
        const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement;

        // 創建 Intersection Observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // 找到最接近視窗頂部的標題
                const visibleHeadings = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => {
                        const element = entry.target as HTMLElement;
                        const rect = element.getBoundingClientRect();
                        return {
                            id: element.id,
                            top: rect.top,
                            bottom: rect.bottom,
                        };
                    })
                    .sort((a, b) => {
                        // 優先選擇最接近頂部（120px 位置）的標題
                        const targetTop = 120;
                        return Math.abs(a.top - targetTop) - Math.abs(b.top - targetTop);
                    });

                if (visibleHeadings.length > 0) {
                    setActiveId(visibleHeadings[0].id);
                } else {
                    // 如果沒有可見標題，檢查當前滾動位置
                    if (!scrollContainer) return;
                    
                    const scrollPosition = scrollContainer.scrollTop + 120;
                    let activeHeadingId = '';
                    
                    // 從上往下找，找到第一個已經滾過去的標題
                    for (let i = 0; i < headingElements.length; i++) {
                        const element = headingElements[i];
                        const elementRect = element.getBoundingClientRect();
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
                        
                        if (elementTop <= scrollPosition) {
                            activeHeadingId = element.id;
                        } else {
                            break;
                        }
                    }
                    
                    // 如果找到了，設置為活動項
                    if (activeHeadingId) {
                        setActiveId(activeHeadingId);
                    } else if (headingElements.length > 0) {
                        // 如果都沒找到，使用第一個標題
                        setActiveId(headingElements[0].id);
                    }
                }
            },
            {
                root: scrollContainer || null,
                rootMargin: '-120px 0px -70% 0px',
                threshold: [0, 0.1, 0.5, 1],
            }
        );

        headingElements.forEach((element) => {
            observerRef.current?.observe(element);
        });

        // 添加滾動事件監聽器作為備份
        const handleScroll = () => {
            if (!scrollContainer) return;
            
            const scrollPosition = scrollContainer.scrollTop + 120;
            let activeHeadingId = '';
            
            // 從上往下找，找到第一個已經滾過去的標題
            for (let i = 0; i < headingElements.length; i++) {
                const element = headingElements[i];
                const elementRect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
                
                if (elementTop <= scrollPosition) {
                    activeHeadingId = element.id;
                } else {
                    break;
                }
            }
            
            if (activeHeadingId) {
                setActiveId(activeHeadingId);
            }
        };

        // 使用節流來優化性能
        let scrollTimeout: NodeJS.Timeout | null = null;
        const throttledHandleScroll = () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 100);
        };

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', throttledHandleScroll, { passive: true });
        }

        return () => {
            if (observerRef.current) {
                headingElements.forEach((element) => {
                    observerRef.current?.unobserve(element);
                });
            }
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', throttledHandleScroll);
            }
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, [headings]);

    // 處理點擊跳轉
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
            return;
        }

        // 找到滾動容器（main 元素）
        const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement;
        if (!scrollContainer) {
            console.warn('Scroll container not found');
            return;
        }

        const offset = 120; // 考慮固定導航欄的高度
        
        // 獲取元素相對於滾動容器的位置
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
        const targetPosition = elementTop - offset;

        // 滾動容器到目標位置
        scrollContainer.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth',
        });

        // 立即設置活動項
        setActiveId(id);
    };

    // 如果沒有標題，不顯示目錄
    if (headings.length === 0) {
        return null;
    }

    return (
        <nav
            className={`hidden lg:block fixed top-24 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-custom z-10 transition-all duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
            style={{ left: `${leftPosition}px` }}
            aria-label={lang === 'zh-TW' ? '目錄' : 'Table of Contents'}
        >
            <ul className="space-y-0.5">
                {headings.map((heading, index) => {
                    const isActive = activeId === heading.id;
                    // 調整縮進：h2 對應 level 2，但視覺上應該是第一級（pl-0）
                    const indentClass = {
                        2: 'pl-0',  // h2
                        3: 'pl-3',  // h3
                        4: 'pl-6',  // h4
                        5: 'pl-9',  // h5
                        6: 'pl-12', // h6
                    }[heading.level] || 'pl-0';

                    // 確保 key 唯一：使用 id + index 作為後備
                    const uniqueKey = heading.id && heading.id.trim() !== '' 
                        ? heading.id 
                        : `heading-${index}`;

                    return (
                        <li key={uniqueKey} className={indentClass}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(heading.id, e)}
                                className={`block py-1.5 text-sm transition-all duration-200 ${
                                    isActive
                                        ? isDark
                                            ? 'text-gray-200 font-medium'
                                            : 'text-gray-900 font-medium'
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
        </nav>
    );
}

