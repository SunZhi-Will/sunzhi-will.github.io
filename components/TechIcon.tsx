import { motion } from "framer-motion";
import { memo } from "react";
import Image from "next/image";

// 添加 Tech Stack 項目的圖標組件
export const TechIcon = memo(({ name, icon, delay = 0 }: { name: string; icon: string; delay?: number }) => (
    <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: delay
        }}
        whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
        }}
        className="group"
    >
        <div className="
        hex-container relative
        w-32 h-32
        bg-gradient-to-br from-blue-600/20 to-blue-900/40
        backdrop-blur-sm
        flex flex-col items-center justify-center
        transition-all duration-300
        border border-blue-500/20
        group-hover:border-blue-400/50
        group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
        overflow-hidden
      ">
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
                src={icon}
                alt={name}
                width={48}
                height={48}
                className="mb-2 group-hover:scale-110 transition-transform filter brightness-125 contrast-125"
            />
            <p className="text-blue-200 text-sm font-medium">{name}</p>
        </div>
    </motion.div>
));
TechIcon.displayName = 'TechIcon';