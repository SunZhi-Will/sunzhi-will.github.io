'use client'

import { motion } from "framer-motion";

export default function GradientBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            {/* 主要背景 - 改為藍色系漸層 */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-blue-900 to-slate-900"></div>

            {/* 動態光暈效果 - 加強藍色系 */}
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
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/30 via-blue-600/10 to-transparent"
            />

            {/* 網格效果 - 調整為更明顯的藍色 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
    );
} 