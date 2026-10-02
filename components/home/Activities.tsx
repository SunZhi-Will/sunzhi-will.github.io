'use client'

import { useEffect, useMemo, useState } from 'react';
import { CoverImage } from './CoverImage';
import { ProjectDetail } from './ProjectDetail';
import { SectionHeading } from './SectionHeading';
import { coverOf, type ShowcaseItem } from './showcase';
import { Reveal } from '@/components/motion/Reveal';
import { translations } from '@/data/translations';
import type { Lang } from '@/types';

export function Activities({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  useEffect(() => setDetailIndex(null), [lang]);

  // 黑客松、演講、教學攤平成同一份清單，卡片上用類型標籤區分
  const items = useMemo(() => {
    const { hackathons, speaking, teaching } = t.activities;
    return [hackathons, speaking, teaching].flatMap((group) =>
      group.items.map((item) => ({ type: group.title, item: item as ShowcaseItem }))
    );
  }, [t]);

  // 最後一列不足三張時，讓卡片平均分掉整列寬度
  const remainder = items.length % 3;
  const spanFor = (i: number) => {
    if (remainder === 0 || i < items.length - remainder) return 'lg:col-span-2';
    return remainder === 2 ? 'lg:col-span-3' : 'lg:col-span-6';
  };

  return (
    <section id="activities" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04" title={t.activities.title} />

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
          {items.map(({ type, item }, i) => {
            const cover = coverOf(item);
            return (
              <li key={item.title} className={spanFor(i)}>
                <Reveal delay={(i % 3) * 0.08}>
                  <button type="button" onClick={() => setDetailIndex(i)} className="group block w-full text-left">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                      {cover && (
                        <CoverImage
                          src={cover.src}
                          alt=""
                          position="center"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-zinc-100 backdrop-blur-sm">
                        {type}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-yellow-400">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      <ProjectDetail
        items={items.map(({ item }) => item)}
        index={detailIndex}
        lang={lang}
        onChange={setDetailIndex}
        onClose={() => setDetailIndex(null)}
      />
    </section>
  );
}
