'use client'

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MediaCarousel } from './MediaCarousel';
import { type ShowcaseItem, splitShowcaseTitle } from './showcase';
import { EASE_OUT } from '@/components/motion/ease';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

interface ProjectDetailProps {
  items: ShowcaseItem[];
  index: number | null;
  lang: Lang;
  onChange: (index: number) => void;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 專案與活動共用的詳情彈窗。支援 Esc 關閉、方向鍵切換上下一個、Tab 焦點鎖定
export function ProjectDetail({ items, index, lang, onChange, onClose }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const item = isOpen ? items[index] : undefined;
  const total = items.length;

  // 開啟期間鎖住背景捲動，關閉後把焦點還給原本的元素
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (index === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onChange((index + 1) % total);
      else if (e.key === 'ArrowLeft') onChange((index - 1 + total) % total);
      else if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, total, onChange, onClose]);

  // 切換項目時回到內容頂端
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const t = translations[lang].projects;
  const copy = homeCopy[lang].work;
  const title = item ? splitShowcaseTitle(item) : undefined;

  const links = item
    ? [
        item.link && { href: item.link, label: item.buttonText || t.viewProject },
        item.demo && { href: item.demo, label: t.liveDemo },
        item.links?.ios && { href: item.links.ios, label: 'App Store' },
        item.links?.android && { href: item.links.android, label: 'Play Store' },
      ].filter((link): link is { href: string; label: string } => Boolean(link))
    : [];

  return (
    <AnimatePresence>
      {item && title && index !== null && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#111113] shadow-2xl md:max-h-[86vh] md:max-w-[1080px] md:rounded-[28px]"
            initial={{ opacity: 0, y: 80, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 md:px-7">
              <span className="eyebrow truncate">
                {item.category}
                {item.startYear ? ` · ${item.startYear}` : ''}
              </span>
              <div className="flex items-center gap-3">
                <span className="eyebrow" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label={copy.close}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors duration-200 hover:border-white/30 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={scrollRef} data-lenis-prevent className="scrollbar-custom flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.title}
                  className="md:grid md:grid-cols-[1.15fr_1fr]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  <div className="p-4 md:sticky md:top-0 md:self-start md:p-6">
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <MediaCarousel
                        media={item.media}
                        title={item.title}
                        labels={{ play: copy.playVideo, prev: copy.prev, next: copy.next }}
                      />
                    </div>
                  </div>

                  <div className="px-5 pb-8 pt-2 md:px-7 md:py-8 md:pl-2">
                    <h3 id="project-detail-title" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {title.name}
                    </h3>
                    {title.tagline !== item.category && <p className="mt-1 text-sm text-zinc-400">{title.tagline}</p>}

                    <p className="mt-5 text-[15px] leading-relaxed text-zinc-300">{item.description}</p>

                    {links.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        {links.map((link, i) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                              i === 0
                                ? 'bg-white text-zinc-950 hover:bg-yellow-400'
                                : 'border border-white/15 text-zinc-200 hover:border-white/40 hover:text-white'
                            }`}
                          >
                            {link.label} <span aria-hidden="true">↗</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {item.achievements && item.achievements.length > 0 && (
                      <div className="mt-8">
                        <span className="eyebrow">{t.mainAchievements.replace(/[：:]\s*$/, '')}</span>
                        <ul className="mt-3 space-y-2.5">
                          {item.achievements.map((achievement) => (
                            <li key={achievement} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                              <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-yellow-400/80" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.technologies && item.technologies.length > 0 && (
                      <ul className="mt-8 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <li key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {total > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 md:px-5">
                <button
                  type="button"
                  onClick={() => onChange((index - 1 + total) % total)}
                  className="rounded-full px-3 py-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
                >
                  <span aria-hidden="true">←</span> {copy.prev}
                </button>
                <button
                  type="button"
                  onClick={() => onChange((index + 1) % total)}
                  className="rounded-full px-3 py-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
                >
                  {copy.next} <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
