'use client'

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Lang } from '@/types';
import { useTheme } from '@/app/blog/ThemeProvider';

interface CommentSectionProps {
    postSlug: string;
    postTitle: string;
    lang: Lang;
    postUrl: string;
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

export function CommentSection({ postSlug, postTitle, lang, postUrl }: CommentSectionProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const disqusRef = useRef<HTMLDivElement>(null);

    // Disqus shortname - 從環境變數取得並驗證
    const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
    
    // 驗證 shortname 格式，防止注入攻擊
    // Disqus shortname 只能包含字母、數字、連字號和底線
    // 添加長度限制（3-50 字元）防止 DoS 攻擊
    const isValidShortname = disqusShortname && 
                             /^[a-zA-Z0-9_-]+$/.test(disqusShortname) &&
                             disqusShortname.length >= 3 &&
                             disqusShortname.length <= 50;

    // Disqus identifier（使用 slug）
    const disqusIdentifier = postSlug;

    useEffect(() => {
        if (!isValidShortname) return;

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
    }, [postSlug, postTitle, postUrl, disqusIdentifier, isValidShortname]);

    const loadDisqus = () => {
        if (!isValidShortname || !window.disqus_config) return;

        // 如果 Disqus 已經載入，重置它
        if (window.DISQUS) {
            window.DISQUS.reset({
                reload: true,
                config: window.disqus_config
            });
        }
    };

    if (!isValidShortname) return null;

    return (
        <section>
            <h2 className={`text-lg font-light mb-6 ${
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
                    `.replace(/\$\{disqusShortname\}/g, disqusShortname || ''),
                }}
            />

            {/* Disqus 容器 */}
            <div ref={disqusRef} id="disqus_thread" className="disqus-container" />
        </section>
    );
}

