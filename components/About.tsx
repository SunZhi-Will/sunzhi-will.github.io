'use client'

import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import { forwardRef } from 'react';

interface AboutProps {
  lang: Lang;
  aboutInView: boolean;
}

export const About = forwardRef<HTMLElement, AboutProps>(({ lang, aboutInView }, ref) => {
  return (
    <section ref={ref} id="about" className="py-12 sm:py-24 relative">
      <div className="container mx-auto px-4">
        <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 shadow-xl">
          <div className="p-4 sm:p-8">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                {translations[lang].about.title}
              </h2>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
            </div>
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <p className={`text-blue-100 text-base sm:text-lg leading-relaxed ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                {translations[lang].aboutContent.intro}
              </p>

              {/* 工作經驗時間線 */}
              <div className="space-y-4">
                {translations[lang].aboutContent.experiences
                  .filter((exp: { period?: string }) => exp.period)
                  .map((exp, index) => (
                    <motion.div
                      key={exp.title}
                      initial={{ x: -50, opacity: 0 }}
                      animate={aboutInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ delay: index * 0.2 }}
                      className="relative pl-6 sm:pl-8 pb-6 sm:pb-8 last:pb-0"
                    >
                      {/* 時間線 */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 
                                       rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                      </div>

                      <div className="bg-blue-900/20 rounded-lg p-4 sm:p-6 border border-blue-500/10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-blue-300">{exp.title}</h3>
                          <span className="text-blue-400 text-sm">{exp.period}</span>
                        </div>
                        <p className={`text-blue-100 mb-4 text-sm sm:text-base ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                          {exp.description}
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className={`flex items-start sm:items-center text-sm sm:text-base text-blue-200 ${lang === 'zh-TW' ? 'text-justify' : ''}`}>
                              <span className="text-blue-400 mr-2 mt-1 sm:mt-0">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* 教學與顧問服務 */}
              <div className="mt-8 sm:mt-12">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-300 mb-4 sm:mb-6">
                  {translations[lang].about.services.title}
                </h3>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={aboutInView ? { y: 0, opacity: 1 } : {}}
                  className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-blue-300">
                      {translations[lang].about.services.title}
                    </h4>
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300">
                      {translations[lang].about.services.available}
                    </span>
                  </div>

                  <p className="text-blue-200 mb-6">
                    {translations[lang].about.services.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {translations[lang].services.items.map((service, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                        <div>
                          <span className="text-blue-200 font-medium">{service.title}</span>
                          <p className="text-blue-300/70 text-sm mt-1">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-blue-300 mb-4">
                    {translations[lang].about.teaching.title}
                  </h4>
                  <p className="text-blue-200 mb-6">
                    {translations[lang].about.teaching.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {translations[lang].teaching.courses.map((course, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-blue-950/40 rounded-lg">
                        <span className="text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="text-blue-200">{course}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
});

About.displayName = 'About'; 