import { motion } from "framer-motion";

// 添加自定義按鈕組件
export const GlowingButton = ({ href, className, children }: {
    href: string;
    className?: string;
    children: React.ReactNode
}) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`
        relative group overflow-hidden px-8 py-4 rounded-full
        flex items-center justify-center gap-2
        font-medium text-sm sm:text-base
        transition-all duration-300
        ${className}
      `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 animate-pulse" />
        </div>
        {children}
    </motion.a>
);