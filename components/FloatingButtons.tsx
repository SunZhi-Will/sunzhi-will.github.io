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
                    bg-gradient-to-r from-primary/90 to-primary-dark/90 
                    shadow-lg hover:shadow-primary/50 transition-all duration-300
                    text-white relative z-50"
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
                            className="from-[#6e40c9]/90 to-[#4c2889]/90 hover:shadow-[#6e40c9]/50"
                            iconClassName="[filter:invert(1)]"
                            label="GitHub"
                        />

                        {/* LinkedIn 按鈕 */}
                        <SocialButton
                            href="https://www.linkedin.com/in/sunzhi-will"
                            icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                            position={{ x: -42, y: -42 }}
                            className="from-[#0077b5]/90 to-[#0a66c2]/90 hover:shadow-[#0077b5]/50"
                            label="LinkedIn"
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
    label?: string;
}

const SocialButton = ({ href, icon, position, className, iconClassName, label }: SocialButtonProps) => (
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
            absolute text-white group`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <Image
            src={icon}
            alt={label || ""}
            width={20}
            height={20}
            className={`${iconClassName} group-hover:rotate-12 transition-transform duration-300`}
        />
        {label && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-text/90 text-bg text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {label}
            </span>
        )}
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
            bg-gradient-to-r from-primary/90 to-primary-dark/90 
            shadow-lg hover:shadow-primary/50 transition-all duration-300
            absolute text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    </motion.a>
); 