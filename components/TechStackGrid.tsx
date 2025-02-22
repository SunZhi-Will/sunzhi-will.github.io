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
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                        {translations.title}
                    </h2>
                    <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full" />
                </div>
            )}

            {/* 分類過濾按鈕 */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full transition-all duration-300
            ${!selectedCategory
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
                >
                    {translations.categories.all}
                </button>
                {techStacks.map(category => (
                    <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className={`px-4 py-2 rounded-full transition-all duration-300
              ${selectedCategory === category.category
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
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