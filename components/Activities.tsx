'use client'

import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { ProjectMedia } from '@/components/ProjectMedia';
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import { useInView } from "react-intersection-observer";

interface ActivitiesProps {
  lang: Lang;
  currentSlides: Record<string, number>;
  setCurrentSlides: (slides: Record<string, number>) => void;
}

export const Activities = ({ lang, currentSlides, setCurrentSlides }: ActivitiesProps) => {
  const [activitiesRef, activitiesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={activitiesRef} id="activities" className="py-24 relative">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
          >
            {translations[lang].activities.title}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={activitiesInView ? { width: 120 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-slate-400 via-gray-300 to-slate-200 rounded-full shadow-glow"
          />
        </div>

        {/* Hackathons */}
        <div className="w-full max-w-5xl mb-16">
          <h3 className="text-2xl font-bold text-slate-300 mb-8">
            {translations[lang].activities.hackathons.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {translations[lang].activities.hackathons.items.map((hackathon, index) => (
              <motion.div
                key={hackathon.title}
                initial={{ opacity: 0, y: 20 }}
                animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-modern">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden">
                      <ProjectMedia
                        media={hackathon.media}
                        title={hackathon.title}
                        currentSlide={currentSlides[hackathon.title] || 0}
                        onSlideChange={(index) => setCurrentSlides({ ...currentSlides, [hackathon.title]: index })}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-slate-500/60 to-gray-400/60 backdrop-blur-md border border-slate-400/30 rounded-full text-sm font-semibold text-white shadow-lg shadow-glow flex items-center gap-2 transition-all duration-300 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor">
                          <path d="M192-384q-40 0-68-28t-28-68q0-40 28-68t68-28v-72q0-29.7 21.15-50.85Q234.3-720 264-720h120q0-40 28-68t68-28q40 0 68 28t28 68h120q29.7 0 50.85 21.15Q768-677.7 768-648v72q40 0 68 28t28 68q0 40-28 68t-68 28v168q0 29.7-21.16 50.85Q725.68-144 695.96-144H263.72Q234-144 213-165.15T192-216v-168Zm168-72q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm228 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14ZM336-312h288v-72H336v72Zm-72 96h432v-432H264v432Zm216-216Z" />
                        </svg>
                        {hackathon.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold bg-gradient-to-r from-slate-200 via-gray-200 to-slate-100 bg-clip-text text-transparent mb-3">{hackathon.title}</h4>
                    <p className="text-slate-100 mb-4 leading-relaxed">{hackathon.description}</p>
                    <div className="space-y-4">
                      <div>
                          <h5 className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-slate-400 to-gray-300 rounded-full"></span>
                            {translations[lang].projects.mainAchievements}
                          </h5>
                          <ul className="space-y-1.5">
                            {hackathon.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start text-slate-100 text-sm group/item">
                                <span className="text-slate-400 mr-2 mt-0.5 group-hover/item:text-gray-300 transition-colors">▹</span>
                                <span className="leading-relaxed">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.technologies.map((tech, i) => (
                          <span
                            key={i}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-500/15 hover:bg-slate-500/25 
                                         border border-slate-400/20 hover:border-slate-400/40
                                         rounded-lg text-xs text-slate-100 font-medium
                                       transition-all duration-300 cursor-default
                                       backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Speaking */}
        <div className="w-full max-w-5xl mb-16">
          <h3 className="text-2xl font-bold text-slate-300 mb-8">
            {translations[lang].activities.speaking.title}
          </h3>
          <div className="grid grid-cols-1 gap-8">
            {translations[lang].activities.speaking.items.map((speaking, index) => (
              <motion.div
                key={speaking.title}
                initial={{ opacity: 0, y: 20 }}
                animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-modern">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                      <div className="aspect-video relative overflow-hidden">
                        <ProjectMedia
                          media={speaking.media}
                          title={speaking.title}
                          currentSlide={currentSlides[speaking.title] || 0}
                          onSlideChange={(index) => setCurrentSlides({ ...currentSlides, [speaking.title]: index })}
                        />
                      </div>
                    </div>
                    <div className="p-6 md:w-1/2">
                      <div className="mb-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-gray-500/30 to-slate-500/30 border border-gray-400/30 rounded-full text-sm text-gray-100 font-semibold shadow-glow">
                          {speaking.category}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold bg-gradient-to-r from-slate-200 via-gray-200 to-slate-100 bg-clip-text text-transparent mb-3">{speaking.title}</h4>
                      <p className="text-slate-100 mb-4 leading-relaxed">{speaking.description}</p>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-blue-300 font-semibold mb-2">
                            {translations[lang].projects.mainAchievements}
                          </h5>
                          <ul className="space-y-1">
                            {speaking.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start text-blue-200 text-sm">
                                <span className="text-blue-400 mr-2 mt-0.5">▹</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {speaking.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-500/15 hover:bg-gray-500/25 
                                         border border-gray-400/20 hover:border-gray-400/40
                                         rounded-lg text-xs text-gray-100 font-medium
                                         transition-all duration-300 cursor-default
                                         backdrop-blur-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teaching */}
        <div className="w-full max-w-5xl">
          <h3 className="text-2xl font-bold text-slate-300 mb-8">
            {translations[lang].activities.teaching.title}
          </h3>
          <div className="grid grid-cols-1 gap-8">
            {translations[lang].activities.teaching.items.map((teaching, index) => (
              <motion.div
                key={teaching.title}
                initial={{ opacity: 0, y: 20 }}
                animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-modern">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                      <div className="aspect-video relative overflow-hidden">
                        <ProjectMedia
                          media={teaching.media}
                          title={teaching.title}
                          currentSlide={currentSlides[teaching.title] || 0}
                          onSlideChange={(index) => setCurrentSlides({ ...currentSlides, [teaching.title]: index })}
                        />
                      </div>
                    </div>
                    <div className="p-6 md:w-1/2">
                      <div className="mb-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-slate-500/30 to-gray-500/30 border border-slate-400/30 rounded-full text-sm text-slate-100 font-semibold shadow-glow">
                          {teaching.category}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold bg-gradient-to-r from-slate-200 via-gray-200 to-slate-100 bg-clip-text text-transparent mb-3">{teaching.title}</h4>
                      <p className="text-slate-100 mb-4 leading-relaxed">{teaching.description}</p>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-blue-300 font-semibold mb-2">
                            {translations[lang].projects.mainAchievements}
                          </h5>
                          <ul className="space-y-1">
                            {teaching.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start text-blue-200 text-sm">
                                <span className="text-blue-400 mr-2 mt-0.5">▹</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {teaching.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-500/15 hover:bg-slate-500/25 
                                         border border-slate-400/20 hover:border-slate-400/40
                                         rounded-lg text-xs text-slate-100 font-medium
                                         transition-all duration-300 cursor-default
                                         backdrop-blur-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 