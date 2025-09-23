'use client'

import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import Image from "next/image";
import Masonry from 'react-masonry-css';
import { ProjectMedia } from '@/components/ProjectMedia';
import { Lang } from '@/types';
import { translations } from '@/data/translations';
import { forwardRef } from 'react';

interface ProjectsProps {
  lang: Lang;
  projectsInView: boolean;
  currentSlides: Record<string, number>;
  setCurrentSlides: (slides: Record<string, number>) => void;
}

const breakpointColumnsObj = {
  default: 2,
  992: 1,
  768: 1,
  480: 1
};

export const Projects = forwardRef<HTMLElement, ProjectsProps>(({ lang, projectsInView, currentSlides, setCurrentSlides }, ref) => {
  const projects = translations[lang].projects.items;

  const handleSlideChange = (title: string, index: number) => {
    setCurrentSlides({
      ...currentSlides,
      [title]: index
    });
  };

  return (
    <section ref={ref} id="projects" className="py-24 relative">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
            {translations[lang].projects.title}
          </h2>
          <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid w-full max-w-5xl px-0 sm:px-4"
          columnClassName="my-masonry-grid_column"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="mb-8 w-full"
            >
              <Card className="bg-blue-950/40 backdrop-blur-md border border-blue-500/20 
                            shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden group">
                    <ProjectMedia
                      media={project.media}
                      title={project.title}
                      currentSlide={currentSlides[project.title] || 0}
                      onSlideChange={(index) => handleSlideChange(project.title, index)}
                    />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="
                      px-4 py-2 
                      bg-gradient-to-r from-blue-500/50 to-blue-600/50
                      backdrop-blur-md 
                      border border-blue-400/20
                      rounded-full 
                      text-sm font-medium
                      text-blue-100
                      shadow-lg shadow-blue-500/20
                      flex items-center gap-2
                    ">
                      {/* 根據類別添加對應圖標 */}
                      {(project.category === "AI 開發" || project.category === "AI Development") && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M192-384q-40 0-68-28t-28-68q0-40 28-68t68-28v-72q0-29.7 21.15-50.85Q234.3-720 264-720h120q0-40 28-68t68-28q40 0 68 28t28 68h120q29.7 0 50.85 21.15Q768-677.7 768-648v72q40 0 68 28t28 68q0 40-28 68t-68 28v168q0 29.7-21.16 50.85Q725.68-144 695.96-144H263.72Q234-144 213-165.15T192-216v-168Zm168-72q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm228 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14ZM336-312h288v-72H336v72Zm-72 96h432v-432H264v432Zm216-216Z" /></svg>
                      )}
                      {(project.category === "演講分享" || project.category === "Speaking") && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4" fill="currentColor"><path d="M240-384h336v-72H240v72Zm0-132h480v-72H240v72Zm0-132h480v-72H240v72ZM96-96v-696q0-29.7 21.15-50.85Q138.3-864 168-864h624q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H240L96-96Zm114-216h582v-480H168v522l42-42Zm-42 0v-480 480Z" /></svg>
                      )}
                      {(project.category === "企業應用" || project.category === "Enterprise Solutions") && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" />
                        </svg>
                      )}
                      {(project.category === "遊戲開發" || project.category === "Game Development") && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5Zm16-86 114-114h336l114 114q2 2 16 6 11 0 17.5-6.5T800-304l-44-308q-4-29-26-48.5T678-680H282q-30 0-52 19.5T204-612l-44 308q-2 11 4.5 17.5T182-280q2 0 16-6Zm482-154q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-80-120q17 0 28.5-11.5T640-600q0-17-11.5-28.5T600-640q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560ZM310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70v70Zm170-40Z" /></svg>
                      )}
                      {(project.category === "移動應用開發" || project.category === "Mobile App Development") && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-200v120h400v-120H280Zm0-80h400v-400H280v400Zm0-480h400v-40H280v40Zm0 0v-40 40Zm0 560v120-120Z" /></svg>
                      )}
                      {(project.category === "後端開發" || project.category === "Backend Development") && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-120q-33 0-56.5-23.5T80-200v-240q0-33 23.5-56.5T160-520h160v-80q0-33 23.5-56.5T400-680h160q33 0 56.5 23.5T640-600v80h160q33 0 56.5 23.5T880-440v240q0 33-23.5 56.5T800-120H160Zm240-400h160v-80H400v80ZM160-200h640v-240H160v240Zm240-120q17 0 28.5-11.5T440-360q0-17-11.5-28.5T400-400q-17 0-28.5 11.5T360-360q0 17 11.5 28.5T400-320Zm160 0q17 0 28.5-11.5T600-360q0-17-11.5-28.5T560-400q-17 0-28.5 11.5T520-360q0 17 11.5 28.5T560-320ZM160-200v-240 240Z" /></svg>
                      )}
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-300">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-blue-200">{project.description}</p>

                  {/* 成就列表 */}
                  {project.achievements && (
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                        {translations[lang].projects.mainAchievements}
                      </h4>
                      <ul className="space-y-0.5 sm:space-y-1">
                        {project.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start text-blue-200 text-xs sm:text-sm">
                            <span className="text-blue-400 mr-1 sm:mr-2 mt-0.5">▹</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 技術標籤和連結區域 */}
                  {(project.technologies || project.link || project.links) && (
                    <div className="flex flex-col gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4">
                      {/* 技術標籤 */}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/10 rounded-md text-xs text-blue-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 連結按鈕區域 */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {/* 專案連結 */}
                        {project.link && (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/20 text-blue-300 text-xs sm:text-sm hover:bg-blue-500/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {project.buttonText === "Chrome擴充功能" || project.buttonText === "Chrome Extension" ? (
                              <Image
                                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg"
                                alt="Chrome"
                                width={14}
                                height={14}
                                className="sm:w-4 sm:h-4"
                              />
                            ) : (
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                            {project.buttonText || translations[lang].projects.viewProject}
                          </motion.a>
                        )}

                        {/* Demo 連結 */}
                        {project.demo && (
                          <motion.a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 text-xs sm:text-sm hover:from-purple-500/30 hover:to-indigo-500/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {translations[lang].projects.liveDemo}
                          </motion.a>
                        )}

                        {/* App Store 連結 */}
                        {project.links?.ios && (
                          <motion.a
                            href={project.links.ios}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 text-xs sm:text-sm hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                              alt="App Store"
                              width={14}
                              height={14}
                              className="[filter:invert(1)] sm:w-4 sm:h-4"
                            />
                            App Store
                          </motion.a>
                        )}

                        {/* Play Store 連結 */}
                        {project.links?.android && (
                          <motion.a
                            href={project.links.android}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs sm:text-sm hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"
                              alt="Play Store"
                              width={14}
                              height={14}
                              className="sm:w-4 sm:h-4"
                            />
                            Play Store
                          </motion.a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </Masonry>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects'; 