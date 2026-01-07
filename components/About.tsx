'use client'

import { motion } from "framer-motion";
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import { forwardRef, useMemo } from 'react';

interface AboutProps {
  lang: Lang;
  aboutInView: boolean;
}

// 簡單的 HTML 清理函數，只允許安全的標籤
function sanitizeHtml(html: string): string {
  // 只允許基本的格式化標籤
  const allowedTags = ['strong', 'em', 'b', 'i', 'br', 'p'];
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  
  return html.replace(tagPattern, (match, tagName) => {
    const lowerTag = tagName.toLowerCase();
    if (allowedTags.includes(lowerTag)) {
      // 移除所有屬性，只保留標籤名
      return match.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/, `<$1${lowerTag}>`);
    }
    // 移除不允許的標籤
    return '';
  });
}

export const About = forwardRef<HTMLElement, AboutProps>(({ lang, aboutInView }, ref) => {
  // 清理 HTML 內容，防止 XSS
  const sanitizedIntro = useMemo(() => {
    return sanitizeHtml(translations[lang].aboutContent.intro);
  }, [lang]);

  return (
    <section ref={ref} id="about" className="py-12 sm:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 標題區塊 */}
          <div className="flex flex-col items-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4"
            >
              {translations[lang].about.title}
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={aboutInView ? { width: 120 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-slate-400 via-gray-300 to-slate-200 rounded-full shadow-glow"
            />
          </div>

          {/* 內容區域 */}
          <div className="space-y-8 sm:space-y-12">
            {/* 介紹文字 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-slate-50 text-base sm:text-lg leading-relaxed"
            >
              <div
                className={`whitespace-pre-line ${lang === 'zh-TW' ? 'text-justify' : ''}`}
                dangerouslySetInnerHTML={{ __html: sanitizedIntro }}
              />
            </motion.div>

            {/* 工作經驗時間線 */}
            <div className="space-y-6">
              {translations[lang].aboutContent.experiences
                .filter((exp: { period?: string }) => exp.period)
                .map((exp, index) => (
                  <motion.div
                    key={exp.title}
                    initial={{ x: -50, opacity: 0 }}
                    animate={aboutInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2 + index * 0.15 }}
                    className="relative pl-8 sm:pl-10"
                  >
                    {/* 時間線 */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/30 via-blue-400/40 to-blue-500/30">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)] ring-2 ring-blue-500/20" />
                    </div>

                    <div className="pl-6 sm:pl-8">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                        <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-200 via-gray-200 to-slate-100 bg-clip-text text-transparent">
                          {exp.title}
                        </h4>
                        <span className="text-slate-300 text-sm font-medium px-3 py-1.5 bg-slate-500/20 rounded-full border border-slate-400/30 backdrop-blur-sm inline-flex w-fit">
                          {exp.period}
                        </span>
                      </div>
                      <p className={`text-slate-50 mb-4 text-sm sm:text-base leading-relaxed ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                        {exp.description}
                      </p>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className={`flex items-start text-sm sm:text-base text-slate-100 group/item ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                            <span className="text-slate-400 mr-2 mt-1 group-hover/item:text-blue-300 transition-colors flex-shrink-0">▹</span>
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* 教學與顧問服務 */}
            <div className="pt-6 border-t border-slate-500/20">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={aboutInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">
                    {translations[lang].about.services.title}
                  </h3>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-full text-sm text-blue-200 font-semibold shadow-glow backdrop-blur-sm inline-flex w-fit">
                    {translations[lang].about.services.available}
                  </span>
                </div>

                <p className="text-slate-50 mb-8 leading-relaxed text-base sm:text-lg">
                  {translations[lang].about.services.description}
                </p>

                {/* 服務項目 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {translations[lang].services.items.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-5 bg-slate-800/20 hover:bg-slate-800/30 rounded-xl border border-slate-500/20 hover:border-slate-400/40 transition-all duration-300 backdrop-blur-sm group"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-100 font-semibold mb-1.5 text-base">{service.title}</h4>
                        <p className="text-slate-300/80 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 教學課程 */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-slate-200 to-gray-200 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-blue-400 to-blue-300 rounded-full"></span>
                    {translations[lang].about.teaching.title}
                  </h4>
                  <p className="text-slate-50 mb-6 leading-relaxed text-base">
                    {translations[lang].about.teaching.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {translations[lang].teaching.courses.map((course, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-slate-800/15 hover:bg-slate-800/25 rounded-lg border border-slate-500/15 hover:border-slate-400/30 transition-all duration-300 backdrop-blur-sm group"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-slate-100 font-medium text-sm sm:text-base">{course}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About'; 