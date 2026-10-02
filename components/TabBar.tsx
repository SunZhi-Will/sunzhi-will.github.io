'use client'

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/components/motion/ease';
import { useHideOnScroll } from '@/lib/use-hide-on-scroll';
import { scrollToSection } from '@/lib/use-site-lang';
import type { Lang } from '@/types';

export type TabId = 'home' | 'blog' | 'pricing' | 'links';

const ICONS: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5',
  blog: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  pricing: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  links: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  sunkoro: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
};

const TABS: Array<{ id: TabId | 'sunkoro'; href: string; zh: string; en: string; external?: boolean }> = [
  { id: 'home', href: '/', zh: '首頁', en: 'Home' },
  { id: 'blog', href: '/blog', zh: '部落格', en: 'Blog' },
  { id: 'pricing', href: '/pricing', zh: '服務費用', en: 'Pricing' },
  { id: 'links', href: '/links', zh: '個人連結', en: 'Links' },
  { id: 'sunkoro', href: 'https://sunkoro.com', zh: 'Sunkoro', en: 'Sunkoro', external: true },
];

interface TabBarProps {
  current: TabId;
  lang: Lang;
  // 部落格有淺色主題，其他頁面固定深色
  theme?: 'dark' | 'light';
  // 往下閱讀時收起，騰出閱讀空間
  hideOnScroll?: boolean;
}

function Icon({ name }: { name: string }) {
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>
  );
}

// 手機專用的底部分頁列：固定在畫面下緣，五個圖示加文字，目前頁面亮黃色。
// 直立握持時大拇指搆得到，也是手機 App 最熟悉的操作方式。桌面版由頂部的導覽膠囊負責
export function TabBar({ current, lang, theme = 'dark', hideOnScroll = false }: TabBarProps) {
  const dark = theme === 'dark';
  const zh = lang === 'zh-TW';
  const scrolledDown = useHideOnScroll();
  const hidden = hideOnScroll && scrolledDown;

  const shell = dark ? 'border-white/10 bg-[#0a0a0a]/90' : 'border-stone-300/70 bg-[#faf9f7]/92';
  const idle = dark ? 'text-zinc-200' : 'text-stone-600';
  const active = dark ? 'text-yellow-400' : 'text-amber-700';
  const pill = dark ? 'bg-yellow-400/15' : 'bg-amber-600/12';

  const render = (tab: (typeof TABS)[number]): ReactNode => {
    const isActive = tab.id === current;
    const label = zh ? tab.zh : tab.en;
    const content = (
      <>
        <span className="relative flex h-8 w-14 items-center justify-center">
          {isActive && (
            <motion.span
              layoutId="tabbar-active"
              className={`absolute inset-0 rounded-full ${pill}`}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative">
            <Icon name={tab.id} />
          </span>
        </span>
        <span className="text-[11px] font-medium leading-none">{label}</span>
      </>
    );
    const className = `flex flex-1 flex-col items-center gap-1 pb-1 pt-1.5 transition-colors duration-200 active:scale-95 ${isActive ? active : idle}`;

    if (tab.external) {
      return (
        <a key={tab.id} href={tab.href} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      );
    }
    return (
      <Link
        key={tab.id}
        href={tab.href}
        aria-current={isActive ? 'page' : undefined}
        // 已經在首頁時，點「首頁」是回到最上面，而不是什麼都不發生
        onClick={(e) => {
          if (tab.id === 'home' && current === 'home') {
            e.preventDefault();
            scrollToSection('home');
          }
        }}
        className={className}
      >
        {content}
      </Link>
    );
  };

  return (
    <motion.nav
      aria-label={zh ? '主要導覽' : 'Main'}
      className={`fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 md:hidden ${shell} ${hidden ? 'translate-y-full' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="mx-auto flex max-w-md items-stretch px-1">{TABS.map(render)}</div>
    </motion.nav>
  );
}
