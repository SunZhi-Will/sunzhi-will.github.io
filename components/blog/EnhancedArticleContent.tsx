'use client'

import { useEffect, useRef, Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from '@/app/blog/ThemeProvider';
import { Lang } from '@/types';
import { Callout } from './Callout';
import { StepGuide } from './StepGuide';
import { StatsHighlight } from './StatsHighlight';
import { InsightQuote } from './InsightQuote';
import { ArticleConclusion } from './ArticleConclusion';
import { BookmarkCard } from './BookmarkCard';

interface EnhancedArticleContentProps {
    htmlContent?: string;
    mdxSource?: MDXRemoteSerializeResult; // 序列化的 MDX 內容
    postSlug: string;
    lang: Lang;
}
// MDX 組件映射
const mdxComponents = {
    InsightQuote,
    Callout,
    StepGuide,
    StatsHighlight,
    ArticleConclusion,
    BookmarkCard,
};

export function EnhancedArticleContent({
    htmlContent,
    mdxSource,
    postSlug, // eslint-disable-line @typescript-eslint/no-unused-vars
    lang, // eslint-disable-line @typescript-eslint/no-unused-vars
}: EnhancedArticleContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 內容增強功能 - 適用於 MDX 與 HTML
    useEffect(() => {
        // 確保 DOM 節點已掛載
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

        // 高亮重要數字（保留原有的 HTML 結構，特別是 strong 標籤）
        const paragraphs = contentRef.current.querySelectorAll('p');
        paragraphs.forEach((p) => {
            const text = p.textContent || '';
            // 匹配百分比和重要數字
            const numberPattern = /(\d+(?:\.\d+)?%)/g;
            if (numberPattern.test(text)) {
                // 遞歸處理節點，保留 HTML 結構
                const processNode = (node: Node): Node[] => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const textNode = node as Text;
                        const text = textNode.textContent || '';
                        const matches = Array.from(text.matchAll(numberPattern));

                        if (matches.length === 0) {
                            return [textNode.cloneNode()];
                        }

                        const parts: Node[] = [];
                        let lastIndex = 0;

                        for (const match of matches) {
                            // 添加匹配前的文字
                            if (match.index !== undefined && match.index > lastIndex) {
                                const beforeText = text.substring(lastIndex, match.index);
                                if (beforeText) {
                                    parts.push(document.createTextNode(beforeText));
                                }
                            }
                            // 創建高亮 span
                            const span = document.createElement('span');
                            span.className = `font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`;
                            span.textContent = match[0];
                            parts.push(span);
                            lastIndex = match.index + match[0].length;
                        }
                        // 添加剩餘文字
                        if (lastIndex < text.length) {
                            const remainingText = text.substring(lastIndex);
                            if (remainingText) {
                                parts.push(document.createTextNode(remainingText));
                            }
                        }

                        return parts;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        // 特別處理 strong 標籤，保留其樣式
                        if (element.tagName.toLowerCase() === 'strong') {
                            const clonedStrong = element.cloneNode() as HTMLElement;
                            clonedStrong.innerHTML = '';
                            const childParts = Array.from(element.childNodes).flatMap(processNode);
                            childParts.forEach(child => clonedStrong.appendChild(child));
                            return [clonedStrong];
                        } else {
                            const clonedElement = element.cloneNode() as HTMLElement;
                            clonedElement.innerHTML = '';
                            const childParts = Array.from(element.childNodes).flatMap(processNode);
                            childParts.forEach(child => clonedElement.appendChild(child));
                            return [clonedElement];
                        }
                    }
                    return [node.cloneNode()];
                };

                // 應用處理結果
                const newNodes = Array.from(p.childNodes).flatMap(processNode);
                p.innerHTML = '';
                newNodes.forEach(node => p.appendChild(node));
            }
        });

        // 增強代碼塊 - 添加複製按鈕
        const codeBlocks = contentRef.current.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            if (!codeBlock.parentElement?.querySelector('.copy-button')) {
                const pre = codeBlock.parentElement as HTMLElement;
                const button = document.createElement('button');
                button.className = 'copy-button absolute top-3 right-3 px-2 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors';
                button.textContent = 'Copy';
                button.onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(codeBlock.textContent || '');
                        button.textContent = 'Copied!';
                        setTimeout(() => button.textContent = 'Copy', 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                };
                pre.style.position = 'relative';
                pre.appendChild(button);
            }
        });
    }, [htmlContent, isDark, mdxSource]);

    // 如果有 MDX 內容，渲染 MDX
    if (mdxSource) {
        return (
            <div className="space-y-8">
                <div
                    ref={contentRef}
                    className={`prose prose-base max-w-none
                        prose-h1:text-2xl prose-h1:mt-14 prose-h1:mb-8 prose-h1:font-semibold prose-h1:leading-tight prose-h1:tracking-normal prose-h1:pb-4 prose-h1:border-b prose-h1:border-opacity-20
                        prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-semibold prose-h2:leading-tight prose-h2:tracking-normal prose-h2:pb-3 prose-h2:border-b prose-h2:border-opacity-15
                        prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-5 prose-h3:font-semibold prose-h3:leading-tight prose-h3:tracking-normal
                        prose-h4:text-base prose-h4:mt-8 prose-h4:mb-4 prose-h4:font-semibold prose-h4:leading-tight
                        prose-p:leading-[1.9] prose-p:font-normal prose-p:text-[17px] prose-p:mb-7 prose-p:break-words
                        prose-a:no-underline prose-a:border-b prose-a:border-opacity-50 prose-a:transition-all prose-a:font-medium prose-a:break-words prose-a:pb-0.5
                        prose-strong:font-semibold
                        prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:bg-opacity-60
                        prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-10 prose-pre:border prose-pre:border-opacity-20
                        prose-pre code:bg-transparent prose-pre code:px-0 prose-pre code:py-0 prose-pre code:border-0
                        prose-blockquote:border-l-2 prose-blockquote:border-opacity-40 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-none prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:my-10 prose-blockquote:leading-relaxed prose-blockquote:bg-opacity-30
                        prose-ul:my-7 prose-ol:my-7
                        prose-li:leading-relaxed prose-li:break-words
                        prose-img:rounded-lg prose-img:my-10 prose-img:border prose-img:border-opacity-20 prose-img:transition-opacity prose-img:hover:opacity-90
                        prose-hr:my-14 prose-hr:border-opacity-20 prose-hr:has(+h2):my-4
                        prose-th:border-opacity-30 prose-th:px-4 prose-th:py-2 prose-th:font-semibold
                        prose-td:border-opacity-30 prose-td:px-4 prose-td:py-2 prose-td:break-words
                        ${isDark
                            ? `prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-gray-50 prose-h1:border-b-gray-700/20 prose-h2:border-b-gray-700/15
                            prose-p:text-gray-200
                            prose-a:text-yellow-200 prose-a:border-yellow-300/50 hover:prose-a:border-yellow-200 hover:prose-a:text-yellow-100
                            prose-strong:text-gray-100
                            prose-code:text-gray-300 prose-code:bg-gray-800/60
                            prose-pre:bg-gray-900/60 prose-pre:border-gray-700/20
                            prose-blockquote:text-gray-200 prose-blockquote:border-gray-500/50 prose-blockquote:bg-gray-800/40
                            prose-ul:text-gray-200 prose-ol:text-gray-200
                            prose-li:marker:text-gray-500
                            prose-img:opacity-95 prose-img:border-gray-700/20
                            prose-hr:border-gray-700/20
                            prose-table:text-gray-200 prose-th:border-gray-700/30 prose-th:bg-gray-800/40
                            prose-td:border-gray-700/30`
                            : `prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-gray-950 prose-h1:border-b-gray-300/20 prose-h2:border-b-gray-300/15
                            prose-p:text-gray-800
                            prose-a:text-yellow-700 prose-a:border-yellow-500/50 hover:prose-a:border-cyan-700 hover:prose-a:text-yellow-900
                            prose-strong:text-gray-900
                            prose-code:text-gray-800 prose-code:bg-gray-100/60
                            prose-pre:bg-gray-50/60 prose-pre:border-gray-300/20
                            prose-blockquote:text-gray-800 prose-blockquote:border-gray-400/50 prose-blockquote:bg-gray-50/80
                            prose-ul:text-gray-800 prose-ol:text-gray-800
                            prose-li:marker:text-gray-500
                            prose-img:opacity-95 prose-img:border-gray-300/20
                            prose-hr:border-gray-300/20
                            prose-table:text-gray-700 prose-th:border-gray-300/30 prose-th:bg-gray-100/20
                            prose-td:border-gray-300/30`
                        }`}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <MDXRemote {...mdxSource} components={mdxComponents} />
                    </Suspense>
                </div>
            </div>
        );
    }

    // 如果沒有 HTML 內容，返回 null
    if (!htmlContent) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* 文章內容 - 使用 dangerouslySetInnerHTML 正確渲染 HTML */}
            <div
                ref={contentRef}
                className={`prose prose-base max-w-none
                    prose-h1:text-2xl prose-h1:mt-14 prose-h1:mb-8 prose-h1:font-semibold prose-h1:leading-tight prose-h1:tracking-normal prose-h1:pb-4 prose-h1:border-b prose-h1:border-opacity-20
                    prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-semibold prose-h2:leading-tight prose-h2:tracking-normal prose-h2:pb-3 prose-h2:border-b prose-h2:border-opacity-15
                    prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-5 prose-h3:font-semibold prose-h3:leading-tight prose-h3:tracking-normal
                    prose-h4:text-base prose-h4:mt-8 prose-h4:mb-4 prose-h4:font-semibold prose-h4:leading-tight
                    prose-p:leading-[1.9] prose-p:font-normal prose-p:text-[17px] prose-p:mb-7 prose-p:break-words
                    prose-a:no-underline prose-a:border-b prose-a:border-opacity-50 prose-a:transition-all prose-a:font-medium prose-a:break-words prose-a:pb-0.5
                    prose-strong:font-semibold
                    prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:bg-opacity-60
                    prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-10 prose-pre:border prose-pre:border-opacity-20
                    prose-pre code:bg-transparent prose-pre code:px-0 prose-pre code:py-0 prose-pre code:border-0
                    prose-blockquote:border-l-2 prose-blockquote:border-opacity-40 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-none prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:my-10 prose-blockquote:leading-relaxed prose-blockquote:bg-opacity-30
                    prose-ul:my-7 prose-ol:my-7
                    prose-li:leading-relaxed prose-li:break-words
                    prose-img:rounded-lg prose-img:my-10 prose-img:border prose-img:border-opacity-20 prose-img:transition-opacity prose-img:hover:opacity-90
                    prose-hr:my-14 prose-hr:border-opacity-20
                    prose-th:border-opacity-30 prose-th:px-4 prose-th:py-2 prose-th:font-semibold
                    prose-td:border-opacity-30 prose-td:px-4 prose-td:py-2 prose-td:break-words
                    ${isDark
                        ? `prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-gray-50 prose-h1:border-b-gray-700/20 prose-h2:border-b-gray-700/15
                        prose-p:text-gray-200
                        prose-a:text-yellow-200 prose-a:border-yellow-300/50 hover:prose-a:border-yellow-200 hover:prose-a:text-yellow-100
                        prose-strong:text-gray-100
                        prose-code:text-gray-300 prose-code:bg-gray-800/60
                        prose-pre:bg-gray-900/60 prose-pre:border-gray-700/20
                        prose-blockquote:text-gray-200 prose-blockquote:border-gray-500/50 prose-blockquote:bg-gray-800/40
                        prose-ul:text-gray-200 prose-ol:text-gray-200
                        prose-li:marker:text-gray-500
                        prose-img:opacity-95 prose-img:border-gray-700/20
                        prose-hr:border-gray-700/20
                        prose-table:text-gray-200 prose-th:border-gray-700/30 prose-th:bg-gray-800/40
                        prose-td:border-gray-700/30`
                        : `prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-gray-950 prose-h1:border-b-gray-300/20 prose-h2:border-b-gray-300/15
                        prose-p:text-gray-800
                        prose-a:text-yellow-700 prose-a:border-yellow-500/50 hover:prose-a:border-cyan-700 hover:prose-a:text-yellow-900
                        prose-strong:text-gray-900
                        prose-code:text-gray-800 prose-code:bg-gray-100/60
                        prose-pre:bg-gray-50/60 prose-pre:border-gray-300/20
                        prose-blockquote:text-gray-800 prose-blockquote:border-gray-400/50 prose-blockquote:bg-gray-50/80
                        prose-ul:text-gray-800 prose-ol:text-gray-800
                        prose-li:marker:text-gray-500
                        prose-img:opacity-95 prose-img:border-gray-300/20
                        prose-hr:border-gray-300/20
                        prose-table:text-gray-700 prose-th:border-gray-300/30 prose-th:bg-gray-100/20
                        prose-td:border-gray-300/30`
                    }`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
