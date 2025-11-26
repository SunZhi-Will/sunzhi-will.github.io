'use client'

import { motion } from "framer-motion";

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* 主要背景 - 銀色系深色漸層 */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"></div>

            {/* 動態光暈效果 - 銀色系 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.25, 0.15, 0.25],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-slate-400/15 via-slate-500/8 to-transparent rounded-full blur-3xl"
            />
            
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.1, 0.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
                className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-gray-400/15 via-slate-300/8 to-transparent rounded-full blur-3xl"
            />

            {/* 網格效果 - 銀色系 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>
            
            {/* 頂部光暈效果 - 銀色系 */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-slate-400/10 via-transparent to-transparent"></div>
        </div>
    );
} 