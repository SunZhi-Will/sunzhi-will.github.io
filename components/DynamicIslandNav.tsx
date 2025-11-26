'use client'

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Lang } from '@/types';
import { translations } from '@/data/translations';

interface DynamicIslandNavProps {
    lang: Lang;
    activeSection: string;
    scrollToSection: (id: string) => void;
    setLang: (lang: Lang) => void;
}

export const DynamicIslandNav = ({
    lang,
    activeSection,
    scrollToSection,
    setLang
}: DynamicIslandNavProps) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
        { id: 'home', name: translations[lang].nav.home },
        { id: 'about', name: translations[lang].nav.about },
        { id: 'skills', name: translations[lang].nav.skills },
        { id: 'activities', name: translations[lang].nav.activities },
        { id: 'projects', name: translations[lang].nav.projects },
    ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 pointer-events-auto ${scrolled ? '' : 'w-full'
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className={`
                    relative overflow-hidden
                    ${scrolled
                        ? 'mx-auto max-w-fit rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-400/40 shadow-2xl mt-4'
                        : 'w-full bg-transparent border-0 shadow-none'
                    }
                    transition-all duration-300 ease-out
                `}
            >
                <div className={`flex items-center justify-center gap-1.5 sm:gap-2 ${scrolled
                        ? 'px-3 sm:px-4 md:px-5 py-2.5 sm:py-3'
                        : 'px-4 sm:px-6 md:px-8 py-4 sm:py-5'
                    }`}>
                    {sections.map((section, index) => (
                        <motion.button
                            key={section.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                            onClick={() => scrollToSection(section.id)}
                            className={`
                  relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
                  text-xs sm:text-sm font-medium
                  transition-all duration-200
                  whitespace-nowrap
                  ${activeSection === section.id
                                    ? 'text-white bg-slate-700/70 shadow-lg'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                }
                `}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeSection === section.id && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-500/50 to-gray-500/50"
                                    layoutId="activeSection"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{section.name}</span>
                        </motion.button>
                    ))}

                    {/* 分隔線 */}
                    <div className="w-px h-6 bg-slate-600/50 mx-0.5 sm:mx-1"></div>

                    {/* 語言切換按鈕 */}
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sections.length * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium
                        text-slate-300 hover:text-white hover:bg-slate-800/50
                        transition-all duration-200 whitespace-nowrap"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {lang === 'zh-TW' ? 'EN' : '中文'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.nav>
    );
};
