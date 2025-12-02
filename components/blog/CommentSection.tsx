'use client'

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Lang } from '@/types';
import { blogTranslations } from '@/lib/blog-translations';

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

    if (!disqusShortname) {
        return (
            <section>
                <h2 className="text-lg font-normal text-slate-100 mb-6">
                    {lang === 'zh-TW' ? '留言' : 'Comments'}
                </h2>
                <div className="p-4 bg-slate-900/20 border border-slate-800/20 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">
                        {lang === 'zh-TW'
                            ? '💡 提示：請設置環境變數 NEXT_PUBLIC_DISQUS_SHORTNAME 來啟用 Disqus 留言系統。'
                            : '💡 Tip: Please set the NEXT_PUBLIC_DISQUS_SHORTNAME environment variable to enable Disqus comments.'
                        }
                    </p>
                    <p className="text-xs text-slate-600">
                        {lang === 'zh-TW'
                            ? '前往 Disqus 註冊並取得您的 shortname：https://disqus.com/admin/create/'
                            : 'Register at Disqus and get your shortname: https://disqus.com/admin/create/'
                        }
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <h2 className="text-lg font-normal text-slate-100 mb-6">
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

