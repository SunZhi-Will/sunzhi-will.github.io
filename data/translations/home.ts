import type { Lang } from '@/types';

// 首頁改版後新增的介面文案。既有內容仍放在 common.ts，這裡只放新版面需要的字串
export const homeCopy: Record<Lang, {
    hero: {
        greeting: string;
        name: string;
        alias: string;
        tagline: string;
    };
    nav: { menu: string; contact: string };
    about: {
        focusLabel: string;
        experienceLabel: string;
        stats: { years: string; projects: string; activities: string };
        showDetails: string;
        hideDetails: string;
        pricingLink: string;
    };
    work: {
        featured: string;
        all: string;
        details: string;
        showAll: string;
        showLess: string;
        prev: string;
        next: string;
        close: string;
        playVideo: string;
    };
    skills: { hint: string };
    contact: {
        label: string;
        title: string;
        copy: string;
        copied: string;
        backToTop: string;
        pricing: string;
        links: string;
    };
}> = {
    'zh-TW': {
        hero: {
            greeting: '你好，我是',
            name: '謝上智',
            alias: 'Sun',
            tagline: '把想法做成真正能用的產品：AI 應用、全端 Web，以及 Unity 互動體驗。'
        },
        nav: { menu: '選單', contact: '聯絡' },
        about: {
            focusLabel: '目前主導',
            experienceLabel: '工作經歷',
            stats: { years: '年開發經驗', projects: '個專案作品', activities: '場活動與分享' },
            showDetails: '展開細節',
            hideDetails: '收合細節',
            pricingLink: '查看服務費用'
        },
        work: {
            featured: '精選專案',
            all: '全部專案',
            details: '查看詳情',
            showAll: '顯示全部',
            showLess: '收合',
            prev: '上一個',
            next: '下一個',
            close: '關閉',
            playVideo: '播放影片'
        },
        skills: { hint: '滑鼠停留可暫停' },
        contact: {
            label: '聯絡',
            title: '有想法？一起把它做出來。',
            copy: '複製信箱',
            copied: '已複製',
            backToTop: '回到頂端',
            pricing: '服務費用',
            links: '個人連結'
        }
    },
    'en': {
        hero: {
            greeting: "Hi, I'm",
            name: 'Sun',
            alias: '謝上智',
            tagline: 'I turn ideas into products people actually use: AI apps, full-stack web, and Unity experiences.'
        },
        nav: { menu: 'Menu', contact: 'Contact' },
        about: {
            focusLabel: 'Currently leading',
            experienceLabel: 'Experience',
            stats: { years: 'years building software', projects: 'projects shipped', activities: 'talks and events' },
            showDetails: 'Show details',
            hideDetails: 'Hide details',
            pricingLink: 'See pricing'
        },
        work: {
            featured: 'Featured',
            all: 'All projects',
            details: 'View details',
            showAll: 'Show all',
            showLess: 'Show less',
            prev: 'Previous',
            next: 'Next',
            close: 'Close',
            playVideo: 'Play video'
        },
        skills: { hint: 'Hover to pause' },
        contact: {
            label: 'Contact',
            title: "Have an idea? Let's build it.",
            copy: 'Copy email',
            copied: 'Copied',
            backToTop: 'Back to top',
            pricing: 'Pricing',
            links: 'Links'
        }
    }
};
