// 更新導航組件
import { motion } from "framer-motion";

export const NavDot = ({ active, name, onClick }: { active: boolean; name: string; onClick: () => void }) => (
    <div className="group flex items-center gap-4 justify-end">
        <motion.span 
            className={`text-slate-100 text-sm font-medium transition-all duration-300
            ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            animate={{ x: active ? 0 : 10 }}
            transition={{ duration: 0.3 }}
        >
            {name}
        </motion.span>
        <motion.button
            onClick={onClick}
            className={`relative rounded-full transition-all duration-300 cursor-pointer
            ${active 
                ? 'w-4 h-4 bg-gradient-to-r from-slate-400 to-gray-300 shadow-glow' 
                : 'w-3 h-3 bg-slate-400/40 hover:bg-slate-400/60 hover:scale-110'}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
        >
            {active && (
                <motion.div
                    className="absolute inset-0 rounded-full bg-slate-400/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.button>
    </div>
);