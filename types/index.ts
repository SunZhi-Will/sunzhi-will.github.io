export type Lang = 'zh-TW' | 'en';

export interface Translations {
    [key: string]: {
        nav: {
            home: string;
            about: string;
            skills: string;
            projects: string;
            activities: string;
            links: string;
            blog: string;
        };
        categories: {
            all: string;
            programming: string;
            framework: string;
            game: string;
            ai: string;
        };
        hero: {
            title: string;
            subtitle: string;
            scrollDown: string;
        };
        about: {
            title: string;
            services: {
                title: string;
                available: string;
                description: string;
            };
            teaching: {
                title: string;
                description: string;
                courses: string[];
            };
        };
        skills: {
            title: string;
        };
        projects: {
            title: string;
            viewProject: string;
            mainAchievements: string;
            video: string;
            liveDemo: string;
            items: Array<{
                title: string;
                description: string;
                buttonText?: string;
                category: string;
                achievements: string[];
                technologies: string[];
                media: Array<{
                    type: 'image' | 'youtube' | 'video';
                    src: string;
                    alt: string;
                }>;
                link?: string;
                links?: {
                    ios?: string;
                    android?: string;
                };
                demo?: string;
            }>;
        };
        activities: {
            title: string;
            hackathons: {
                title: string;
                items: Array<{
                    title: string;
                    description: string;
                    category: string;
                    achievements: string[];
                    technologies: string[];
                    media: Array<{
                        type: 'image' | 'youtube' | 'video';
                        src: string;
                        alt: string;
                    }>;
                }>;
            };
            speaking: {
                title: string;
                items: Array<{
                    title: string;
                    description: string;
                    category: string;
                    achievements: string[];
                    technologies: string[];
                    media: Array<{
                        type: 'image' | 'youtube' | 'video';
                        src: string;
                        alt: string;
                    }>;
                }>;
            };
            teaching: {
                title: string;
                items: Array<{
                    title: string;
                    description: string;
                    category: string;
                    achievements: string[];
                    technologies: string[];
                    media: Array<{
                        type: 'image' | 'youtube' | 'video';
                        src: string;
                        alt: string;
                    }>;
                }>;
            };
        };
        footer: {
            portfolio: string;
            oldWebsite: string;
        };
        techCategories: {
            programming: string;
            framework: string;
            game: string;
            ai: string;
            mobile: string;
            other: string;
        };
        aboutContent: {
            intro: string;
            experiences: Array<{
                title: string;
                period?: string;
                description: string;
                achievements: string[];
            }>;
        };
        services: {
            items: Array<{
                title: string;
                description: string;
            }>;
        };
        teaching: {
            description: string;
            courses: string[];
        };
    };
}

export type MediaContent = {
    type: 'image' | 'youtube' | 'video';
    src: string;
    alt?: string;
};

export type Project = {
    title: string;
    description: string;
    category: string;
    achievements?: string[];
    media?: MediaContent[];
    technologies?: string[];
    link?: string;
    links?: {
        ios?: string;
        android?: string;
    };
    demo?: string;
}; 