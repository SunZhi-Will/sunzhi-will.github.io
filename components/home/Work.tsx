'use client'

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { CoverImage } from './CoverImage';
import { ProjectDetail } from './ProjectDetail';
import { SectionHeading } from './SectionHeading';
import { coverOf, splitShowcaseTitle, type ShowcaseItem } from './showcase';
import { Reveal } from '@/components/motion/Reveal';
import { EASE_OUT } from '@/components/motion/ease';
import { useMediaQuery } from '@/lib/use-media-query';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

// 排序最前面的幾個專案做成置頂堆疊的精選卡，其餘收進可篩選的作品格
const FEATURED_COUNT = 4;
const INITIAL_VISIBLE = 9;

interface FeaturedCardProps {
  item: ShowcaseItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  pinned: boolean;
  detailsLabel: string;
  achievementsLabel: string;
  onOpen: () => void;
}

function FeaturedCard({ item, index, total, progress, pinned, detailsLabel, achievementsLabel, onOpen }: FeaturedCardProps) {
  const { name, tagline } = splitShowcaseTitle(item);
  const cover = coverOf(item);
  // 後面的卡片蓋上來時，前面的卡片往後退一點，疊出層次
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="mb-5 md:sticky md:top-0 md:mb-0 md:flex md:h-screen md:items-center">
      <motion.article
        className="relative w-full origin-top overflow-hidden rounded-[28px] border border-white/10 bg-[#111113] shadow-[0_-24px_60px_rgba(0,0,0,0.55)] md:grid md:h-[min(72vh,620px)] md:grid-cols-[1.25fr_1fr]"
        style={pinned ? { scale, top: index * 18 } : undefined}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${detailsLabel}: ${name}`}
          className="dot-grid group flex aspect-video w-full items-center justify-center overflow-hidden bg-zinc-950 p-4 md:aspect-auto md:h-full md:p-8"
        >
          {cover && (
            // 寬高屬性只是預留比例，實際尺寸由 CSS 依原圖比例決定，完整顯示不裁切
            <Image
              src={cover.src}
              alt={cover.alt}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 700px"
              className="h-auto max-h-full w-auto max-w-full rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
          )}
        </button>

        <div className="flex flex-col p-6 md:p-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow">
              {item.category}
              {item.startYear ? ` · ${item.startYear}` : ''}
            </span>
            <span className="eyebrow" aria-hidden="true">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">{name}</h3>
          <p className="mt-1.5 text-base text-zinc-200">{tagline}</p>
          <p className="mt-5 line-clamp-4 text-[15px] leading-relaxed text-zinc-200">{item.description}</p>

          {item.achievements && item.achievements.length > 0 && (
            <ul className="mt-5 hidden space-y-2 md:block [@media(max-height:780px)]:md:hidden" aria-label={achievementsLabel}>
              {item.achievements.slice(0, 3).map((achievement) => (
                <li key={achievement} className="flex gap-3 text-sm text-zinc-200">
                  <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-yellow-400/80" />
                  <span className="line-clamp-1">{achievement}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-auto md:pt-6">
            <button
              type="button"
              onClick={onOpen}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors duration-300 hover:bg-yellow-400"
            >
              {detailsLabel}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </button>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw text-sm font-medium text-zinc-200 hover:text-white"
              >
                {item.link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

// AnimatePresence 的 popLayout 需要拿到實際的 DOM 節點，所以這裡要轉發 ref
const WorkCard = forwardRef<HTMLLIElement, { item: ShowcaseItem; onOpen: () => void; delay: number }>(({ item, onOpen, delay }, ref) => {
  const { name, tagline } = splitShowcaseTitle(item);
  const cover = coverOf(item);

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay, layout: { duration: 0.5, ease: EASE_OUT } }}
    >
      <button type="button" onClick={onOpen} className="group block w-full text-left">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          {cover && (
            <CoverImage
              src={cover.src}
              alt=""
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          )}
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </div>
        <div className="mt-3.5 flex items-baseline justify-between gap-3">
          <h3 className="truncate text-base font-medium text-zinc-100 transition-colors duration-200 group-hover:text-yellow-400">{name}</h3>
          {item.startYear && <span className="font-geist-mono text-xs text-zinc-200">{item.startYear}</span>}
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-200">{tagline}</p>
      </button>
    </motion.li>
  );
});
WorkCard.displayName = 'WorkCard';

export function Work({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const copy = homeCopy[lang].work;
  const projects = t.projects.items as ShowcaseItem[];
  const featured = projects.slice(0, FEATURED_COUNT);

  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  // 分類名稱跟著語言變，切換語言時把篩選與彈窗重設
  useEffect(() => {
    setFilter(null);
    setDetailIndex(null);
  }, [lang]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => counts.set(project.category, (counts.get(project.category) ?? 0) + 1));
    return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [projects]);

  // 「全部」時不重複顯示上方已出現的精選專案；選了分類則列出該分類的所有專案
  const list = filter ? projects.filter((project) => project.category === filter) : projects.slice(FEATURED_COUNT);
  const visible = expanded ? list : list.slice(0, INITIAL_VISIBLE);
  const hiddenCount = list.length - INITIAL_VISIBLE;

  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduceMotion = useReducedMotion();

  const open = (item: ShowcaseItem) => setDetailIndex(projects.indexOf(item));

  return (
    <section id="projects" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          title={t.projects.title}
          aside={<span className="eyebrow">{copy.featured}</span>}
        />

        <div ref={stackRef} className="md:-mt-[14vh]">
          {featured.map((item, i) => (
            <FeaturedCard
              key={item.title}
              item={item}
              index={i}
              total={featured.length}
              progress={scrollYProgress}
              pinned={isDesktop && !reduceMotion}
              detailsLabel={copy.details}
              achievementsLabel={t.projects.mainAchievements}
              onOpen={() => open(item)}
            />
          ))}
        </div>

        <div className="mt-20 md:mt-10">
          <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{copy.all}</h3>
            <span className="eyebrow">{String(projects.length).padStart(2, '0')}</span>
          </Reveal>

          <Reveal className="-mx-5 mt-6 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:px-0">
            <div className="flex w-max gap-2 md:w-auto md:flex-wrap" role="group" aria-label={copy.all}>
              {[{ name: null as string | null, label: t.categories.all, count: projects.length }, ...categories.map((c) => ({ name: c.name as string | null, label: c.name, count: c.count }))].map((chip) => {
                const isActive = filter === chip.name;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setFilter(chip.name);
                      setExpanded(false);
                    }}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-zinc-950' : 'text-zinc-200 hover:text-yellow-400'
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="work-filter"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full border border-white/10" />
                    )}
                    <span className="relative">
                      {chip.label}
                      <span className={`ml-1.5 font-geist-mono text-[11px] ${isActive ? 'text-zinc-600' : 'text-zinc-200'}`}>{chip.count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <ul className="relative mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((item, i) => (
                <WorkCard key={item.title} item={item} onOpen={() => open(item)} delay={(i % INITIAL_VISIBLE) * 0.04} />
              ))}
            </AnimatePresence>
          </ul>

          {hiddenCount > 0 && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors duration-300 hover:border-white/40 hover:text-white"
              >
                {expanded ? copy.showLess : `${copy.showAll} (${list.length})`}
                <motion.span aria-hidden="true" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                  ↓
                </motion.span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ProjectDetail items={projects} index={detailIndex} lang={lang} onChange={setDetailIndex} onClose={() => setDetailIndex(null)} />
    </section>
  );
}
