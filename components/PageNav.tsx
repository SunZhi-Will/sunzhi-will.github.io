'use client'

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
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
  // 部落格手機版另有自己的導覽列（含搜尋與目錄），這裡就不重複顯示
  desktopOnly?: boolean;
  // 文章頁最左邊的明確返回
  back?: { href: string; label: string };
  // 膠囊右端的頁面專屬工具（部落格的搜尋與主題切換），只在桌面顯示
  tools?: ReactNode;
}

// 首頁以外各頁共用的導覽膠囊，與首頁的導覽列同一套外觀。
// 桌面：置中在畫面上方，列出所有主要頁面。
// 手機：固定在畫面下方（直立握持時大拇指搆得到），收成「Logo 加目前頁面」，點開向上展開
export function PageNav({ current, lang, theme = 'dark', hideOnScroll = false, desktopOnly = false, back, tools }: PageNavProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const scrolledDown = useHideOnScroll();
  const hidden = hideOnScroll && scrolledDown && !open && !focused;
  const dark = theme === 'dark';
  const zh = lang === 'zh-TW';
  const label = (page: (typeof NAV_PAGES)[number]) => (zh ? page.zh : page.en);
  const currentPage = NAV_PAGES.find((page) => page.id === current)!;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

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
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:bottom-auto md:top-0 md:flex md:justify-center md:pb-0 md:pt-4 ${desktopOnly ? 'hidden md:flex' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <nav
        aria-label={zh ? '主要導覽' : 'Main'}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
        className={`pointer-events-auto relative w-full max-w-full overflow-hidden rounded-[22px] border backdrop-blur-xl transition-[transform,opacity,background-color] duration-300 md:w-fit ${shell} ${
          hidden ? 'pointer-events-none max-md:translate-y-[150%] md:-translate-y-[150%] opacity-0' : ''
        }`}
      >
        {/* 手機：選單在上、列在下，所以用 reverse 讓選單向上長出來 */}
        <div className="flex flex-col-reverse md:flex-col">
          <div className="flex items-center gap-1 px-2 py-1.5">
            {back && (
              <>
                <Link
                  href={back.href}
                  className={`hidden items-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 md:flex ${itemBase}`}
                  aria-label={back.label}
                  title={back.label}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden lg:inline">{back.label}</span>
                </Link>
                <span className={`hidden h-4 w-px md:block ${divider}`} />
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

            {/* 桌面：所有主要頁面，目前頁面有底色 */}
            <div className="ml-2 hidden items-center md:flex">
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
                    <span className="relative">{label(page)}</span>
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
                <span className={`mx-1.5 hidden h-4 w-px md:block ${divider}`} />
                <div className="hidden items-center gap-0.5 md:flex">{tools}</div>
              </>
            )}

            {/* 手機：目前頁面加箭頭（向上），點開向上展開 */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="page-nav-menu"
              className={`ml-auto flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[13px] font-medium md:hidden ${itemActive}`}
            >
              {label(currentPage)}
              <motion.svg
                className={`h-3.5 w-3.5 ${dark ? 'text-zinc-300' : 'text-stone-500'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                animate={{ rotate: open ? 0 : 180 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </motion.svg>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="page-nav-menu"
                className="overflow-hidden md:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <div className="flex flex-col px-2 pb-1 pt-3">
                  {NAV_PAGES.map((page, i) => {
                    const active = page.id === current;
                    return (
                      <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.04 * i }}
                      >
                        <Link
                          href={page.href}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-2xl px-3 py-3 text-base font-medium ${active ? `${activeBg} ${itemActive}` : itemBase}`}
                        >
                          {label(page)}
                          {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-yellow-400" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <a
                    href="https://sunkoro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-1 flex items-center justify-between rounded-2xl border px-3 py-3 text-base font-medium ${dark ? 'border-white/10' : 'border-stone-300'} ${sunkoro}`}
                  >
                    Sunkoro <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}
