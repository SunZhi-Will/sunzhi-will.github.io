'use client'

import { motion } from 'framer-motion';

interface DataBarProps {
    label: string;
    value: number;
    maxValue?: number;
    color?: string;
    delay?: number;
}

export function DataBar({ 
    label, 
    value, 
    maxValue = 100, 
    color,
    delay = 0 
}: DataBarProps) {
    const percentage = (value / maxValue) * 100;
    
    // 顏色來自 app/tokens.css，深淺色自動切換；預設長條用品牌色漸層
    const defaultColor = 'from-brand to-brand-text';

    return (
        <div className="my-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-fg-body">
                    {label}
                </span>
                <span className="text-sm font-bold text-fg">
                    {value}%
                </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden bg-fg/10">
                <motion.div
                    className={`h-full bg-gradient-to-r ${color || defaultColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ 
                        duration: 1.5, 
                        delay,
                        ease: 'easeOut' 
                    }}
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    color?: string;
}

export function StatCard({ value, label, icon, color }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-xl border backdrop-blur-sm border-line bg-surface/50"
        >
            {icon && (
                <div className={`text-2xl mb-3 ${color || ''}`}>
                    {icon}
                </div>
            )}
            <div className="text-3xl font-bold mb-2 text-fg">
                {value}
            </div>
            <div className="text-sm text-fg-muted">
                {label}
            </div>
        </motion.div>
    );
}












