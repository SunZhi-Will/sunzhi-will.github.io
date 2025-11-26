import { motion } from "framer-motion";
import { TechIcon } from './TechIcon';
import { useState } from 'react';

// 定義技術堆疊的類型
export interface TechStack {
    category: string;
    items: {
        name: string;
        icon: string;
    }[];
}

interface TechStackGridProps {
    techStacks: TechStack[];
    translations: {
        title?: string;
        categories: {
            all: string;
        };
    };
    className?: string;
    showTitle?: boolean;
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({
    techStacks,
    translations,
    className = "",
    showTitle = true,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // 獲取所有技能
    const allSkills = techStacks.flatMap(category =>
        category.items.map(item => ({
            ...item,
            category: category.category
        }))
    );

    // 過濾技能
    const filteredSkills = selectedCategory
        ? allSkills.filter(skill => skill.category === selectedCategory)
        : allSkills;

    return (
        <div className={`w-full ${className}`}>
            {showTitle && (
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {translations.title}
                    </h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-slate-400 via-gray-300 to-slate-200 rounded-full shadow-glow" />
                </div>
            )}

            {/* 分類過濾按鈕 */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-5 py-2.5 rounded-full transition-all duration-300 font-semibold
            ${!selectedCategory
                            ? 'bg-gradient-to-r from-slate-500 to-gray-400 text-white shadow-glow border border-slate-400/50'
                            : 'bg-slate-500/20 text-slate-200 hover:bg-slate-500/30 border border-slate-400/20 hover:border-slate-400/40 backdrop-blur-sm'}`}
                >
                    {translations.categories.all}
                </button>
                {techStacks.map(category => (
                    <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className={`px-5 py-2.5 rounded-full transition-all duration-300 font-semibold
              ${selectedCategory === category.category
                                ? 'bg-gradient-to-r from-slate-500 to-gray-400 text-white shadow-glow border border-slate-400/50'
                                : 'bg-slate-500/20 text-slate-200 hover:bg-slate-500/30 border border-slate-400/20 hover:border-slate-400/40 backdrop-blur-sm'}`}
                    >
                        {category.category}
                    </button>
                ))}
            </div>

            {/* 技能展示 */}
            <motion.div
                className="flex flex-wrap justify-center gap-6"
                layout
            >
                {filteredSkills.map((tech, index) => (
                    <TechIcon
                        key={tech.name}
                        name={tech.name}
                        icon={tech.icon}
                        delay={index * 0.1}
                    />
                ))}
            </motion.div>
        </div>
    );
}; 