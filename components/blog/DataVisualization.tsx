'use client'

import { motion } from 'framer-motion';
import { useTheme } from '@/app/blog/ThemeProvider';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const percentage = (value / maxValue) * 100;
    
    const defaultColor = isDark 
        ? 'from-blue-500 to-purple-500' 
        : 'from-blue-600 to-purple-600';

    return (
        <div className="my-4">
            <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    {label}
                </span>
                <span className={`text-sm font-bold ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                    {value}%
                </span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-6 rounded-xl border backdrop-blur-sm ${
                isDark
                    ? 'border-gray-700/50 bg-gray-800/30'
                    : 'border-gray-300/50 bg-white/50'
            }`}
        >
            {icon && (
                <div className={`text-2xl mb-3 ${color || ''}`}>
                    {icon}
                </div>
            )}
            <div className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-gray-200' : 'text-gray-900'
            }`}>
                {value}
            </div>
            <div className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
                {label}
            </div>
        </motion.div>
    );
}





