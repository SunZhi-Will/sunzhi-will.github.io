'use client'

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoIcon } from '@/components/LogoIcon';
import { EASE_OUT } from '@/components/motion/ease';
import { useHideOnScroll } from '@/lib/use-hide-on-scroll';
import type { Lang } from '@/types';

export type PageId = 'blog' | 'links' | 'pricing';

export const NAV_PAGES: Array<{ id: 'home' | PageId; href: string; zh: string; en: string }> = [
  { id: 'home', href: '/', zh: '作品集', en: 'Portfolio' },
  { id: 'blog', href: '/blog', zh: '部落格', en: 'Blog' },
  { id: 'pricing', href: '/pricing', zh: '服務費用', en: 'Pricing' },
  { id: 'links', href: '/links', zh: '個人連結', en: 'Links' },
];

interface PageNavProps {
  current: PageId;
  lang: Lang;
  // 部落格有淺色主題，其他頁面固定深色
  theme?: 'dark' | 'light';
  // 部落格往下閱讀時收起，避免蓋住內文
  hideOnScroll?: boolean;
  // 文章頁最左邊的明確返回
  back?: { href: string; label: string };
  // 膠囊右端的頁面專屬工具（部落格的搜尋與主題切換）
  tools?: ReactNode;
}

// 首頁以外各頁共用的桌面導覽膠囊，與首頁的導覽列同一套外觀，置中在畫面上方。
// 手機版沒有這個元件，由底部的 TabBar 負責
export function PageNav({ current, lang, theme = 'dark', hideOnScroll = false, back, tools }: PageNavProps) {
  const [focused, setFocused] = useState(false);
  const scrolledDown = useHideOnScroll();
  const hidden = hideOnScroll && scrolledDown && !focused;
  const dark = theme === 'dark';
  const zh = lang === 'zh-TW';

  const shell = dark
    ? 'border-white/10 bg-[#141416]/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)]'
    : 'border-stone-300/70 bg-[#faf9f7]/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)]';
  const logoText = dark ? 'text-zinc-100' : 'text-stone-900';
  const itemBase = dark ? 'text-zinc-200 hover:text-yellow-400' : 'text-stone-600 hover:text-amber-700';
  const itemActive = dark ? 'text-white' : 'text-stone-900';
  const activeBg = dark ? 'bg-white/10' : 'bg-stone-900/[0.07]';
  const divider = dark ? 'bg-white/10' : 'bg-stone-300';
  const sunkoro = dark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800';

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden justify-center px-3 pt-4 md:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <nav
        aria-label={zh ? '主要導覽' : 'Main'}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
        className={`pointer-events-auto relative w-fit max-w-full overflow-hidden rounded-[22px] border backdrop-blur-xl transition-[transform,opacity,background-color] duration-300 ${shell} ${
          hidden ? 'pointer-events-none -translate-y-[150%] opacity-0' : ''
        }`}
      >
        <div className="flex items-center gap-1 px-2 py-1.5">
          {back && (
            <>
              <Link
                href={back.href}
                className={`flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${itemBase}`}
                aria-label={back.label}
                title={back.label}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden lg:inline">{back.label}</span>
              </Link>
              <span className={`h-4 w-px ${divider}`} />
            </>
          )}

          <Link
            href="/"
            className={`group flex items-center gap-2 rounded-2xl px-2.5 py-1.5 ${logoText}`}
            aria-label={zh ? '回首頁' : 'Home'}
          >
            <LogoIcon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-sm font-semibold">Sun</span>
          </Link>

          <div className="ml-2 flex items-center">
            {NAV_PAGES.map((page) => {
              const active = page.id === current;
              return (
                <Link
                  key={page.id}
                  href={page.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-2xl px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${active ? itemActive : itemBase}`}
                >
                  {active && <span className={`absolute inset-0 rounded-2xl ${activeBg}`} />}
                  <span className="relative">{zh ? page.zh : page.en}</span>
                </Link>
              );
            })}
            <span className={`mx-2 hidden h-4 w-px lg:block ${divider}`} />
            <a
              href="https://sunkoro.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden rounded-2xl px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 lg:inline-block ${sunkoro}`}
            >
              Sunkoro <span aria-hidden="true">↗</span>
            </a>
          </div>

          {tools && (
            <>
              <span className={`mx-1.5 h-4 w-px ${divider}`} />
              <div className="flex items-center gap-0.5">{tools}</div>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
