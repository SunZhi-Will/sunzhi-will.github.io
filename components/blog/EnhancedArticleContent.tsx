'use client'

import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/blog/ThemeProvider';
import { Lang } from '@/types';

interface EnhancedArticleContentProps {
    htmlContent: string;
    postSlug: string;
    lang: Lang;
}

export function EnhancedArticleContent({
    htmlContent,
    postSlug,
    lang,
}: EnhancedArticleContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!contentRef.current) return;

        // 增強連結 - 添加外部連結圖標
        const links = contentRef.current.querySelectorAll('a[href^="http"]');
        links.forEach((link) => {
            if (!link.querySelector('.external-link-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-link-icon ml-1 text-xs';
                icon.textContent = '↗';
                icon.setAttribute('aria-hidden', 'true');
                link.appendChild(icon);
            }
        });

        // 增強圖片 - 添加點擊放大功能
        const images = contentRef.current.querySelectorAll('img');
        images.forEach((img) => {
            img.style.cursor = 'zoom-in';
            img.onclick = () => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm';
                modal.onclick = () => modal.remove();

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg';
                modalImg.onclick = (e) => e.stopPropagation();

                modal.appendChild(modalImg);
                document.body.appendChild(modal);
            };
        });

        // 增強代碼區塊 - 添加複製按鈕
        const codeBlocks = contentRef.current.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            if (pre && !pre.querySelector('.copy-code-btn')) {
                const button = document.createElement('button');
                button.className = `copy-code-btn absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`;
                button.textContent = lang === 'zh-TW' ? '複製' : 'Copy';
                button.onclick = async () => {
                    const text = codeBlock.textContent || '';
                    try {
                        await navigator.clipboard.writeText(text);
                        button.textContent = lang === 'zh-TW' ? '已複製！' : 'Copied!';
                        setTimeout(() => {
                            button.textContent = lang === 'zh-TW' ? '複製' : 'Copy';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
                };
                pre.style.position = 'relative';
                pre.appendChild(button);
            }
        });

        // 增強表格 - 添加滾動容器
        const tables = contentRef.current.querySelectorAll('table');
        tables.forEach((table) => {
            if (!table.parentElement?.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper overflow-x-auto my-6';
                table.parentElement?.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });

        // 高亮重要數字
        const paragraphs = contentRef.current.querySelectorAll('p');
        paragraphs.forEach((p) => {
            const text = p.textContent || '';
            // 匹配百分比和重要數字
            const numberPattern = /(\d+(?:\.\d+)?%)/g;
            if (numberPattern.test(text)) {
                p.innerHTML = text.replace(
                    numberPattern,
                    (match) => `<span class="font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'
                        }">${match}</span>`
                );
            }
            // 確保段落有正確的換行和間距
            p.style.wordBreak = 'break-word';
            p.style.overflowWrap = 'break-word';
        });

        // 優化所有文本元素，確保正確換行
        const textElements = contentRef.current.querySelectorAll('p, li, td, th, a, span');
        textElements.forEach((el) => {
            const element = el as HTMLElement;
            element.style.wordBreak = 'break-word';
            element.style.overflowWrap = 'break-word';
        });

        // 為列表項添加主題類
        const listItems = contentRef.current.querySelectorAll('ul > li, ol > li');
        listItems.forEach((li) => {
            const listItem = li as HTMLElement;
            if (isDark) {
                listItem.classList.add('list-item-dark');
            } else {
                listItem.classList.add('list-item-light');
            }
        });
    }, [htmlContent, isDark, lang, postSlug]);

    return (
        <div className="space-y-8">
            {/* 文章內容 */}
            <div
                ref={contentRef}
                className={`prose prose-base max-w-none
                    prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:font-normal prose-h1:leading-tight
                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-normal prose-h2:leading-tight
                    prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-normal prose-h3:leading-tight
                    prose-h4:text-base prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-normal prose-h4:leading-tight
                    prose-p:leading-[1.8] prose-p:font-normal prose-p:text-[15px] prose-p:mb-6 prose-p:break-words
                    prose-a:no-underline prose-a:border-b prose-a:transition-all prose-a:font-medium prose-a:break-words
                    prose-strong:font-semibold
                    prose-code:px-2 prose-code:py-1 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:break-words
                    prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:backdrop-blur-sm prose-pre:overflow-x-auto prose-pre:my-8
                    prose-pre code:bg-transparent prose-pre code:px-0 prose-pre code:py-0 prose-pre code:border-0
                    prose-blockquote:border-0 prose-blockquote:py-6 prose-blockquote:px-6 prose-blockquote:rounded-xl prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:my-8 prose-blockquote:leading-relaxed prose-blockquote:shadow-lg prose-blockquote:backdrop-blur-sm prose-blockquote:relative prose-blockquote:overflow-hidden
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:leading-relaxed prose-li:break-words
                    prose-img:rounded-xl prose-img:border prose-img:shadow-xl prose-img:my-8 prose-img:transition-transform prose-img:hover:scale-105
                    prose-hr:my-12
                    prose-th:border prose-th:px-4 prose-th:py-2
                    prose-td:border prose-td:px-4 prose-td:py-2 prose-td:break-words
                    ${isDark
                        ? `prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-gray-200
                        prose-p:text-gray-300
                        prose-a:text-gray-400 prose-a:border-gray-600/50 hover:prose-a:border-gray-500 hover:prose-a:text-gray-300
                        prose-strong:text-gray-200
                        prose-code:text-gray-300 prose-code:bg-gray-700/80 prose-code:border-gray-600/50
                        prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700/50
                        prose-blockquote:bg-gradient-to-br prose-blockquote:from-gray-800/60 prose-blockquote:to-gray-900/40 prose-blockquote:text-gray-200 prose-blockquote:border prose-blockquote:border-gray-700/50 prose-blockquote:shadow-gray-900/20
                        prose-ul:text-gray-300 prose-ol:text-gray-300
                        prose-li:marker:text-gray-500
                        prose-img:border-gray-700/50
                        prose-hr:border-gray-700/50
                        prose-table:text-gray-300 prose-th:border-gray-700/50 prose-th:bg-gray-800/30
                        prose-td:border-gray-700/50`
                        : `prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-p:text-gray-700
                        prose-a:text-gray-600 prose-a:border-gray-400/50 hover:prose-a:border-gray-600 hover:prose-a:text-gray-800
                        prose-strong:text-gray-900
                        prose-code:text-gray-800 prose-code:bg-gray-200/80 prose-code:border-gray-300/50
                        prose-pre:bg-gray-100/80 prose-pre:border prose-pre:border-gray-300/50
                        prose-blockquote:bg-gradient-to-br prose-blockquote:from-gray-50 prose-blockquote:to-gray-100/80 prose-blockquote:text-gray-800 prose-blockquote:border prose-blockquote:border-gray-300/50 prose-blockquote:shadow-gray-400/10
                        prose-ul:text-gray-700 prose-ol:text-gray-700
                        prose-li:marker:text-gray-600
                        prose-img:border-gray-300/50
                        prose-hr:border-gray-300/50
                        prose-table:text-gray-700 prose-th:border-gray-300/50 prose-th:bg-gray-200/30
                        prose-td:border-gray-300/50`
                    }`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}

