'use client'

import { useEffect, useRef } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Lang } from '@/types';
import { Callout } from './Callout';
import { StepGuide } from './StepGuide';
import { StatsHighlight } from './StatsHighlight';
import { InsightQuote } from './InsightQuote';
import { ArticleConclusion } from './ArticleConclusion';
import { BookmarkCard } from './BookmarkCard';
import { interactiveMdxComponents } from './interactive';

interface EnhancedArticleContentProps {
    htmlContent?: string;
    mdxSource?: MDXRemoteSerializeResult; // 序列化的 MDX 內容
    postSlug: string;
    lang: Lang;
}
// 內文的版面。顏色來自 app/tokens.css（深淺色自動切換），標題字級寫在 app/blog/blog.css
const PROSE_CLASS = [
    'prose prose-base max-w-none',
    'prose-p:font-normal prose-p:mb-7 prose-p:break-words',
    'prose-a:no-underline prose-a:border-b prose-a:border-brand/50 prose-a:transition-colors prose-a:font-medium prose-a:break-words prose-a:pb-0.5 hover:prose-a:border-brand',
    'prose-strong:font-semibold',
    'prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:rounded prose-code:bg-surface-sunken prose-code:before:content-none prose-code:after:content-none',
    'prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-10 prose-pre:border prose-pre:border-line',
    'prose-blockquote:border-l-2 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-none prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:my-10 prose-blockquote:leading-relaxed prose-blockquote:bg-surface-sunken',
    'prose-ul:my-7 prose-ol:my-7',
    'prose-li:leading-relaxed prose-li:break-words',
    'prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:my-10 prose-img:border prose-img:border-line prose-img:transition-opacity prose-img:hover:opacity-90',
    'prose-hr:my-14 prose-hr:border-line',
].join(' ');

// MDX 組件映射
const mdxComponents = {
    InsightQuote,
    Callout,
    StepGuide,
    StatsHighlight,
    ArticleConclusion,
    BookmarkCard,
    ...interactiveMdxComponents,
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
        <div className="table-wrapper overflow-x-auto my-6">
            <table {...props} />
        </div>
    ),
};

export function EnhancedArticleContent({
    htmlContent,
    mdxSource,
    postSlug, // eslint-disable-line @typescript-eslint/no-unused-vars
    lang, // eslint-disable-line @typescript-eslint/no-unused-vars
}: EnhancedArticleContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

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

        // 增強表格 - 添加滾動容器 (僅在 HTML 渲染時手動操作 DOM，MDX 已由 custom table component 處理)
        if (!mdxSource) {
            const tables = contentRef.current.querySelectorAll('table');
            tables.forEach((table) => {
                if (!table.parentElement?.classList.contains('table-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'table-wrapper overflow-x-auto my-6';
                    table.parentElement?.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                }
            });
        }

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
                            span.className = 'font-semibold text-brand-text';
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
                button.className = 'copy-button absolute top-3 right-3 px-2 py-1 text-xs rounded border border-line bg-surface-raised text-fg transition-colors hover:border-line-strong';
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
    }, [htmlContent, mdxSource]);

    // 如果有 MDX 內容，渲染 MDX
    if (mdxSource) {
        return (
            <div className="space-y-8">
                <div
                    ref={contentRef}
                    className={PROSE_CLASS}
                >
                    {/* 不包 Suspense：包了之後這一段會晚一步 hydrate，上面的 useEffect 會先改到還沒接管的 DOM，造成 hydration 不一致 */}
                    <MDXRemote {...mdxSource} components={mdxComponents} />
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
                className={PROSE_CLASS}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
