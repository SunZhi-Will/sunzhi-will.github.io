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
                className="w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-r from-blue-600/90 to-blue-800/90 
                    shadow-lg hover:shadow-blue-500/50 transition-all duration-300
                    relative z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            position={{ x: -60, y: -0 }}
                            className="from-purple-600/90 to-indigo-800/90 hover:shadow-purple-500/50"
                            iconClassName="[filter:invert(1)]"
                        />

                        {/* LinkedIn 按鈕 */}
                        <SocialButton
                            href="https://www.linkedin.com/in/sunzhi-will"
                            icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                            position={{ x: -42, y: -42 }}
                            className="from-blue-600/90 to-blue-800/90 hover:shadow-blue-500/50"
                        />

                        {/* Email 按鈕 */}
                        <EmailButton
                            href="mailto:sun055676@gmail.com"
                            position={{ x: 0, y: -60 }}
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
        initial={{ scale: 0, x: 6, y: 6 }}
        animate={{ scale: 1, x: position.x, y: position.y }}
        exit={{ scale: 0, x: 6, y: 6, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1, ease: [1, 1, 1, 1] }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-10 h-10 rounded-full flex items-center justify-center
            bg-gradient-to-r ${className} shadow-lg transition-all duration-300
            absolute`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <Image
            src={icon}
            alt=""
            width={20}
            height={20}
            className={iconClassName}
        />
    </motion.a>
);

const EmailButton = ({ href, position }: { href: string; position: { x: number; y: number } }) => (
    <motion.a
        initial={{ scale: 0, x: 6, y: 6 }}
        animate={{ scale: 1, x: position.x, y: position.y }}
        exit={{ scale: 0, x: 6, y: 6, transition: { duration: 0.1 } }}
        transition={{ duration: 0.1, ease: [1, 1, 1, 1] }}
        href={href}
        className="w-10 h-10 rounded-full flex items-center justify-center
            bg-gradient-to-r from-blue-500/90 to-blue-600/90 
            shadow-lg hover:shadow-blue-500/50 transition-all duration-300
            absolute"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </motion.a>
); 