'use client'

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface CommentSectionProps {
    postSlug: string;
    postTitle: string;
    lang: Lang;
}

declare global {
    interface Window {
        DISQUS?: {
            reset: (options: {
                reload: boolean;
                config: () => void;
            }) => void;
        };
        disqus_config?: () => void;
        disqus_shortname?: string;
    }
}

interface DisqusConfig {
    page: {
        identifier: string;
        url: string;
        title: string;
    };
}

export function CommentSection({ postSlug, postTitle, lang }: CommentSectionProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const disqusRef = useRef<HTMLDivElement>(null);

    // Disqus shortname - 從環境變數取得
    const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;

    // 構建完整的文章 URL
    const postUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/blog/${postSlug}`
        : `https://sunzhi-will.github.io/blog/${postSlug}`;

    // Disqus identifier（使用 slug）
    const disqusIdentifier = postSlug;

    useEffect(() => {
        if (!disqusShortname) return;

        // 配置 Disqus
        window.disqus_config = function (this: DisqusConfig) {
            this.page.identifier = disqusIdentifier;
            this.page.url = postUrl;
            this.page.title = postTitle;
        };

        // 當 Disqus 腳本已載入時，重置並重新載入
        if (window.DISQUS && window.disqus_config) {
            window.DISQUS.reset({
                reload: true,
                config: window.disqus_config
            });
        }
    }, [postSlug, postTitle, postUrl, disqusIdentifier, disqusShortname]);

    const loadDisqus = () => {
        if (!disqusShortname || !window.disqus_config) return;

        // 如果 Disqus 已經載入，重置它
        if (window.DISQUS) {
            window.DISQUS.reset({
                reload: true,
                config: window.disqus_config
            });
        }
    };

    if (!disqusShortname) return null;

    return (
        <section>
            <h2 className={`text-lg font-normal mb-6 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
                {lang === 'zh-TW' ? '留言' : 'Comments'}
            </h2>

            {/* Disqus 腳本 */}
            <Script
                id="disqus-script"
                strategy="lazyOnload"
                onLoad={loadDisqus}
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            var d = document, s = d.createElement('script');
                            s.src = 'https://${disqusShortname}.disqus.com/embed.js';
                            s.setAttribute('data-timestamp', +new Date());
                            (d.head || d.body).appendChild(s);
                        })();
                    `,
                }}
            />

            {/* Disqus 容器 */}
            <div ref={disqusRef} id="disqus_thread" className="disqus-container" />
        </section>
    );
}

