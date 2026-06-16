'use client'

import { motion } from "framer-motion";

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* 主要背景 - 純黑色 */}
            <div className="absolute inset-0 bg-black"></div>

            {/* 動態光暈效果 - 純黃色系 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.1, 0.2],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-500/6 via-yellow-600/3 to-transparent rounded-full blur-3xl"
            />
            
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.08, 0.15],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
                className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-400/6 via-yellow-500/3 to-transparent rounded-full blur-3xl"
            />

            {/* 網格效果 - 帶極微黃色微光的黑線網格 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(250,204,21,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,204,21,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>
            
            {/* 頂部光暈效果 - 黃色系 */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-yellow-500/4 via-transparent to-transparent"></div>
        </div>
    );
} 