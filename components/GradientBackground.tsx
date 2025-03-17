'use client'

import { motion } from "framer-motion";

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            {/* 主要背景 - 溫暖的金黃色系漸層 */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-white"></div>

            {/* 動態光暈效果 - 金黃色系 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/30 via-amber-200/10 to-transparent"
            />

            {/* 網格效果 - 淡金色 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf2420_1px,transparent_1px),linear-gradient(to_bottom,#fbbf2420_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            {/* 裝飾性模糊圓形 */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-blob" />
            <div className="absolute top-40 right-20 w-72 h-72 bg-primary-light/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-dark/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />

            {/* 新的背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 to-bg-secondary/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        </div>
    );
} 