'use client'

import Image from 'next/image';
import { Marquee } from '@/components/motion/Marquee';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from './SectionHeading';
import { techStacks } from '@/data/tech-stacks';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

type Tech = { name: string; icon: string };

function MarqueeItem({ tech }: { tech: Tech }) {
  return (
    <span className="group flex items-center gap-4 px-6 md:gap-5 md:px-9">
      <Image
        src={tech.icon}
        alt=""
        width={40}
        height={40}
        className="h-7 w-7 opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-10 md:w-10"
      />
      <span className="whitespace-nowrap text-3xl font-semibold tracking-tight text-zinc-700 transition-colors duration-300 group-hover:text-white md:text-6xl">
        {tech.name}
      </span>
    </span>
  );
}

export function Skills({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const all = techStacks.flatMap((stack) => stack.items);
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)];

  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="px-5 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="03"
            title={t.skills.title}
            aside={<span className="eyebrow hidden md:inline">{homeCopy[lang].skills.hint}</span>}
          />
        </div>
      </div>

      {/* 兩排反向跑馬燈：捲動越快跑越快 */}
      <div className="space-y-4 md:space-y-8" aria-hidden="true">
        {rows.map((row, i) => (
          <Marquee key={i} speed={i === 0 ? 1.6 : -1.6} repeat={2}>
            {row.map((tech) => (
              <MarqueeItem key={tech.name} tech={tech} />
            ))}
          </Marquee>
        ))}
      </div>

      {/* 給想快速掃過的人：依分類列出完整清單 */}
      <div className="mt-16 px-5 md:mt-24 md:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {techStacks.map((stack, i) => (
            <Reveal key={stack.category} delay={i * 0.06}>
              <h3 className="eyebrow border-t border-white/10 pt-4">{t.techCategories[stack.category]}</h3>
              <ul className="mt-4 space-y-2">
                {stack.items.map((tech) => (
                  <li key={tech.name} className="text-[15px] text-zinc-300">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
