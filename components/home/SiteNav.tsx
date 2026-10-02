'use client'

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { LogoIcon } from '@/components/LogoIcon';
import { EASE_OUT } from '@/components/motion/ease';
import { scrollToSection } from '@/lib/use-site-lang';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

export const SECTION_IDS = ['home', 'about', 'projects', 'skills', 'activities'] as const;
type SectionId = (typeof SECTION_IDS)[number];

interface SiteNavProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

// 找出目前橫跨畫面中線的區塊
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -55% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

export function SiteNav({ lang, setLang }: SiteNavProps) {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 40));

  // 展開選單時按 Esc 收合
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const nav = translations[lang].nav;
  const sections = SECTION_IDS.filter((id) => id !== 'home').map((id) => ({ id, name: nav[id] }));

  const go = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
    >
      <nav
        aria-label={homeCopy[lang].nav.menu}
        className={`relative w-full overflow-hidden rounded-[22px] border transition-[background-color,border-color,box-shadow] duration-500 md:w-auto ${
          scrolled || open
            ? 'border-white/10 bg-[#141416]/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center gap-1 px-2 py-1.5">
          <a
            href="#home"
            onClick={(e) => go(e, 'home')}
            className="group flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-zinc-100"
            aria-label={nav.home}
          >
            <LogoIcon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-sm font-semibold">Sun</span>
          </a>

          {/* 桌面版：區塊連結，選中的底色用 layoutId 在項目之間滑動 */}
          <div className="ml-2 hidden items-center md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => go(e, section.id)}
                aria-current={active === section.id ? 'true' : undefined}
                className={`relative rounded-2xl px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  active === section.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {active === section.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-2xl bg-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{section.name}</span>
              </a>
            ))}
            <span className="mx-2 h-4 w-px bg-white/10" />
            <Link
              href="/blog"
              className="rounded-2xl px-3.5 py-2 text-[13px] font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
            >
              {nav.blog}
            </Link>
          </div>

          {/* 手機版：顯示目前區塊，點擊後島嶼向下展開 */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="site-nav-menu"
            className="ml-auto flex items-center gap-2 rounded-2xl px-3 py-2 text-[13px] font-medium text-zinc-200 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {nav[active]}
              </motion.span>
            </AnimatePresence>
            <motion.svg
              className="h-3.5 w-3.5 text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </motion.svg>
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
            className="font-geist-mono rounded-2xl px-3 py-2 text-xs text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
            aria-label={lang === 'zh-TW' ? 'Switch to English' : '切換為中文'}
          >
            {lang === 'zh-TW' ? 'EN' : '中'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="site-nav-menu"
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <div className="flex flex-col px-2 pb-3 pt-1">
                {[...sections, { id: 'contact', name: homeCopy[lang].nav.contact }].map((section, i) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => go(e, section.id)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-base font-medium ${
                      active === section.id ? 'bg-white/10 text-white' : 'text-zinc-300'
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.04 * i }}
                  >
                    {section.name}
                    <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  </motion.a>
                ))}
                <Link
                  href="/blog"
                  className="mt-1 flex items-center justify-between rounded-2xl border border-white/10 px-3 py-3 text-base font-medium text-zinc-300"
                >
                  {nav.blog}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 閱讀進度：膠囊底部的一條細線 */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-yellow-400/80"
          style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
        />
      </nav>
    </motion.header>
  );
}
