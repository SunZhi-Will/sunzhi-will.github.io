'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function FloatingButtons({ show = true }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={`fixed right-4 sm:right-8 bottom-8 z-50 transition-all duration-500
            ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {/* 主按鈕 */}
            <motion.button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="w-10 h-10 rounded-full flex items-center justify-center
                    bg-[#18181b]/95 hover:bg-[#27272a]/95 text-white hover:text-yellow-400
                    border border-[#3f3f46]/80 hover:border-yellow-500/50
                    shadow-lg hover:shadow-glow-yellow-lg transition-all duration-300
                    relative z-50 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </motion.button>

            {/* 花瓣式展開的按鈕組 */}
            <AnimatePresence mode="wait">
                {isMenuOpen && (
                    <div className="absolute inset-0">
                        {/* GitHub 按鈕 */}
                        <SocialButton
                            href="https://github.com/SunZhi-Will"
                            icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                            position={{ x: -50, y: 0 }}
                            className="from-[#18181b] to-black hover:border-yellow-500/50 hover:shadow-glow-yellow"
                            iconClassName="[filter:invert(1)]"
                        />

                        {/* LinkedIn 按鈕 */}
                        <SocialButton
                            href="https://www.linkedin.com/in/sunzhi-will"
                            icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                            position={{ x: -35, y: -35 }}
                            className="from-black to-[#18181b] hover:border-yellow-500/50 hover:shadow-glow-yellow"
                        />

                        {/* Email 按鈕 */}
                        <EmailButton
                            href="mailto:sun055676@gmail.com"
                            position={{ x: 0, y: -50 }}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface SocialButtonProps {
    href: string;
    icon: string;
    position: { x: number; y: number };
    className: string;
    iconClassName?: string;
}

const SocialButton = ({ href, icon, position, className, iconClassName }: SocialButtonProps) => (
    <motion.a
        initial={{ scale: 0, x: 5, y: 5 }}
        animate={{ scale: 1, x: position.x, y: position.y }}
        exit={{ scale: 0, x: 5, y: 5, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1, ease: [1, 1, 1, 1] }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-9 h-9 rounded-full flex items-center justify-center
            bg-gradient-to-r ${className} border border-white/10 hover:border-yellow-500/50
            shadow-lg hover:shadow-glow-yellow transition-all duration-300
            absolute backdrop-blur-sm`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <Image
            src={icon}
            alt=""
            width={16}
            height={16}
            className={iconClassName}
        />
    </motion.a>
);

const EmailButton = ({ href, position }: { href: string; position: { x: number; y: number } }) => (
    <motion.a
        initial={{ scale: 0, x: 5, y: 5 }}
        animate={{ scale: 1, x: position.x, y: position.y }}
        exit={{ scale: 0, x: 5, y: 5, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1, ease: [1, 1, 1, 1] }}
        href={href}
            className="w-9 h-9 rounded-full flex items-center justify-center
            bg-gradient-to-r from-[#18181b]/90 to-[#27272a]/90 text-white hover:text-yellow-400
            border border-[#3f3f46]/50 hover:border-yellow-500/50
            shadow-lg hover:shadow-glow-yellow transition-all duration-300
            absolute backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </motion.a>
); 