'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollHighlight } from '@/components/motion/ScrollHighlight';
import { Spotlight } from '@/components/motion/Spotlight';
import { EASE_OUT } from '@/components/motion/ease';
import { SectionHeading } from './SectionHeading';
import { translations } from '@/data/translations';
import { homeCopy } from '@/data/translations/home';
import type { Lang } from '@/types';

// 第一份工作起算的年份，用來計算開發年資
const CAREER_START_YEAR = 2020;

const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

type Focus = { name: string; note?: string; text: string };

// 把自介文字拆成：開場段、主導專案清單、其餘段落。
// 以「<strong>名稱</strong>：說明」開頭的段落視為專案條目，其餘原樣保留
function parseIntro(intro: string) {
  const paragraphs = intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [lead = '', ...rest] = paragraphs;
  const focus: Focus[] = [];
  const body: string[] = [];
  let focusLabel: string | undefined;

  for (const paragraph of rest) {
    const match = paragraph.match(/^<strong>(.+?)<\/strong>\s*(?:（(.+?)）|\((.+?)\))?\s*[：:]\s*([\s\S]+)$/);
    if (match) {
      focus.push({ name: match[1], note: match[2] || match[3], text: stripTags(match[4]) });
    } else if (!focus.length && /[：:]$/.test(paragraph)) {
      focusLabel = stripTags(paragraph).replace(/[：:]$/, '');
    } else {
      body.push(stripTags(paragraph));
    }
  }

  return { lead: stripTags(lead), focus, focusLabel, body };
}

function splitTitle(title: string) {
  const [company, ...role] = title.split(' - ');
  return { company, role: role.join(' - ') };
}

type Experience = { title: string; period?: string; description: string; achievements: string[] };

// 單筆工作經歷。捲到畫面中下方時自動展開，之後仍可手動收合或再展開
function ExperienceRow({ exp, delay, labels }: { exp: Experience; delay: number; labels: { show: string; hide: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const reached = useInView(ref, { once: true, margin: '0px 0px -35% 0px' });
  const [open, setOpen] = useState(false);
  const { company, role } = splitTitle(exp.title);

  useEffect(() => {
    if (reached) setOpen(true);
  }, [reached]);

  return (
    <div ref={ref}>
      <Reveal delay={delay} className="border-b border-white/10">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={`${company}: ${open ? labels.hide : labels.show}`}
          className="group flex w-full items-start justify-between gap-4 py-6 text-left"
        >
          <span className="grid gap-1 md:grid-cols-[11rem_1fr] md:items-baseline md:gap-8">
            <span className="font-geist-mono text-xs text-zinc-200">{exp.period}</span>
            <span>
              <span className="block text-lg font-semibold text-white md:text-xl">{company}</span>
              {role && <span className="mt-0.5 block text-sm text-zinc-200">{role}</span>}
            </span>
          </span>
          <motion.span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition-colors duration-200 group-hover:border-white/30 group-hover:text-white"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            +
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <div className="pb-8 md:pl-[13rem]">
                <p className="max-w-2xl text-[15px] leading-relaxed text-zinc-200">{exp.description}</p>
                <ul className="mt-4 grid max-w-2xl gap-x-8 gap-y-2 sm:grid-cols-2">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={achievement}
                      className="flex gap-2.5 text-sm leading-relaxed text-zinc-200"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
                    >
                      <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-yellow-400/70" />
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </div>
  );
}

export function About({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const copy = homeCopy[lang].about;
  const intro = useMemo(() => parseIntro(t.aboutContent.intro), [t]);
  const experiences = t.aboutContent.experiences.filter((exp) => exp.period);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.8', 'end 0.6'] });
  const timelineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const activities = t.activities.hackathons.items.length + t.activities.speaking.items.length + t.activities.teaching.items.length;
  const stats = [
    { value: new Date().getFullYear() - CAREER_START_YEAR, suffix: '+', label: copy.stats.years },
    { value: t.projects.items.length, suffix: '', label: copy.stats.projects },
    { value: activities, suffix: '', label: copy.stats.activities },
  ];

  const closing = intro.body.length > 1 ? intro.body[intro.body.length - 1] : undefined;
  const bodyParagraphs = closing ? intro.body.slice(0, -1) : intro.body;

  return (
    <section id="about" className="px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" title={t.about.title} />

        <ScrollHighlight
          text={intro.lead}
          className="max-w-5xl text-2xl font-medium leading-[1.45] tracking-tight text-white md:text-[2.5rem] md:leading-[1.35]"
        />

        {/* 數字 */}
        <div className="mt-16 grid grid-cols-3 border-y border-white/10 md:mt-24">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className={`py-8 md:py-12 ${i > 0 ? 'border-l border-white/10 pl-4 md:pl-10' : ''}`}>
              <p className="text-4xl font-semibold tracking-tight text-white md:text-7xl">
                <CountUp to={stat.value} />
                {stat.suffix && <span className="text-yellow-400">{stat.suffix}</span>}
              </p>
              <p className="mt-2 text-xs text-zinc-200 md:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        {/* 主導專案與補充說明 */}
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Reveal>
              <span className="eyebrow">{copy.focusLabel}</span>
              {bodyParagraphs.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-[15px] leading-relaxed text-zinc-200">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
          <ul className="md:col-span-8">
            {intro.focus.map((item, i) => (
              <li key={item.name} className="group border-t border-white/10 last:border-b">
                <Reveal delay={i * 0.06} className="grid gap-2 py-6 md:grid-cols-[11rem_1fr] md:gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-400">
                      {item.name}
                    </h3>
                    {item.note && <p className="mt-0.5 text-xs text-zinc-200">{item.note}</p>}
                  </div>
                  <p className="text-[15px] leading-relaxed text-zinc-200">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {closing && (
          <Reveal className="mt-16 md:mt-24">
            <blockquote className="max-w-3xl border-l border-yellow-400/60 pl-6 text-xl leading-relaxed text-zinc-200 md:text-2xl">
              {closing}
            </blockquote>
          </Reveal>
        )}

        {/* 工作經歷：左側細線隨捲動向下延伸 */}
        <div className="mt-24 md:mt-36">
          <Reveal>
            <span className="eyebrow">{copy.experienceLabel}</span>
          </Reveal>
          <div ref={timelineRef} className="relative mt-6 pl-6 md:pl-10">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
            <motion.div
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-yellow-400"
              style={{ scaleY: timelineProgress }}
            />
            {experiences.map((exp, i) => (
              <ExperienceRow key={exp.title} exp={exp} delay={i * 0.05} labels={{ show: copy.showDetails, hide: copy.hideDetails }} />
            ))}
          </div>
        </div>

        {/* 服務項目 */}
        <div className="mt-24 md:mt-36">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow">{t.about.services.title}</span>
              <p className="mt-4 text-xl leading-relaxed text-zinc-200 md:text-2xl">{t.about.services.description}</p>
            </div>
            <Link href="/pricing" className="link-draw text-sm font-medium text-zinc-200 hover:text-yellow-400">
              {copy.pricingLink} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {t.services.items.map((service, i) => (
              <Reveal
                key={service.title}
                delay={i * 0.06}
                className={`h-full bg-[#0a0a0a] ${i === t.services.items.length - 1 && t.services.items.length % 2 === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <Spotlight className="h-full p-6">
                  <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-8 text-base font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-200">{service.description}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-4">
              <span className="eyebrow">{t.about.teaching.title}</span>
              <p className="mt-5 text-[15px] leading-relaxed text-zinc-200">{t.about.teaching.description}</p>
            </Reveal>
            <ol className="md:col-span-8">
              {t.teaching.courses.map((course, i) => (
                <li key={course} className="border-t border-white/10 last:border-b">
                  <Reveal delay={i * 0.05} className="flex items-baseline gap-6 py-4">
                    <span className="eyebrow" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-base text-zinc-200">{course}</span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
