import { threadsSaver } from './threads-saver';
import { postly } from './postly';
import { lexitechly } from './lexitechly';
import { coinhub } from './coinhub';
import { sunui } from './sunui';
import { gformAi } from './gform-ai';
import { deepcrawlai } from './deepcrawlai';
import { synvize } from './synvize';
import { snapraze } from './snapraze';
import { memorylane } from './memorylane';
import { factory } from './factory';
import { arGame } from './ar-game';
import { vrGame } from './vr-game';
import { linebot } from './linebot';
import { ithomeHelper } from './ithome-helper';
import { threado } from './threado';
import { broadvize } from './broadvize';
import { cardflow } from './cardflow';
import { aiDebtScanner } from './ai-debt-scanner';
import { skyvize } from './skyvize';
import { allvibe } from './allvibe';
import { voxelWorld } from './voxel-world';
import { vibegame } from './vibegame';
import { ticktive } from './ticktive';
import { promptly } from './promptly';
import { resumeai } from './resumeai';
import { veyoShop } from './veyo-shop';
import { threadsStoryRecap } from './threads-story-recap';
import { codeltp } from './codeltp';
import { fliptok } from './fliptok';
import { openring } from './openring';
import { nexusos } from './nexusos';
import { liminal } from './liminal';
import { taipeiCityDashboard } from './taipei-city-dashboard';
import { vibeacademy } from './vibeacademy';
import { vibeWorkshop } from './vibe-workshop';
import { autolens } from './autolens';
import { zettelify } from './zettelify';
import { toolnest } from './toolnest';
import { carbon } from './carbon';
import { specformula } from './specformula';

type SupportedLang = 'zh-TW' | 'en';

type ProjectItem = {
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
    timelineOrder?: number;
    startYear?: number;
};

type LocalizedProject = Record<SupportedLang, Omit<ProjectItem, 'timelineOrder'>>;

type ProjectEntry = {
    project: LocalizedProject;
    timelineOrder: number;
    startYear?: number;
};

const projectEntries: ProjectEntry[] = [
    { project: nexusos, timelineOrder: 41, startYear: 2026 },
    { project: openring, timelineOrder: 40, startYear: 2026 },
    { project: broadvize, timelineOrder: 39, startYear: 2025 },
    { project: threado, timelineOrder: 38, startYear: 2025 },
    { project: skyvize, timelineOrder: 37, startYear: 2026 },
    { project: resumeai, timelineOrder: 36, startYear: 2025 },
    { project: codeltp, timelineOrder: 35, startYear: 2025 },
    { project: aiDebtScanner, timelineOrder: 34, startYear: 2025 },
    { project: vibegame, timelineOrder: 33, startYear: 2026 },
    { project: voxelWorld, timelineOrder: 32, startYear: 2026 },
    { project: allvibe, timelineOrder: 31, startYear: 2025 },
    { project: ticktive, timelineOrder: 30, startYear: 2025 },
    { project: threadsStoryRecap, timelineOrder: 29, startYear: 2025 },
    { project: cardflow, timelineOrder: 28, startYear: 2025 },
    { project: veyoShop, timelineOrder: 27, startYear: 2025 },
    { project: promptly, timelineOrder: 26, startYear: 2025 },
    { project: fliptok, timelineOrder: 25, startYear: 2025 },
    { project: liminal, timelineOrder: 24, startYear: 2025 },
    { project: taipeiCityDashboard, timelineOrder: 23, startYear: 2025 },
    { project: vibeacademy, timelineOrder: 22, startYear: 2026 },
    { project: vibeWorkshop, timelineOrder: 21, startYear: 2025 },
    { project: autolens, timelineOrder: 20, startYear: 2025 },
    { project: specformula, timelineOrder: 19, startYear: 2025 },
    { project: zettelify, timelineOrder: 18, startYear: 2025 },
    { project: toolnest, timelineOrder: 17, startYear: 2025 },
    { project: ithomeHelper, timelineOrder: 16, startYear: 2024 },
    { project: threadsSaver, timelineOrder: 15, startYear: 2025 },
    { project: postly, timelineOrder: 14, startYear: 2024 },
    { project: lexitechly, timelineOrder: 13, startYear: 2025 },
    { project: coinhub, timelineOrder: 12, startYear: 2025 },
    { project: sunui, timelineOrder: 11, startYear: 2025 },
    { project: gformAi, timelineOrder: 10, startYear: 2025 },
    { project: deepcrawlai, timelineOrder: 9, startYear: 2025 },
    { project: synvize, timelineOrder: 8, startYear: 2025 },
    { project: snapraze, timelineOrder: 7, startYear: 2025 },
    { project: memorylane, timelineOrder: 6, startYear: 2025 },
    { project: factory, timelineOrder: 5, startYear: 2025 },
    { project: carbon, timelineOrder: 4, startYear: 2017 },
    { project: arGame, timelineOrder: 3, startYear: 2024 },
    { project: vrGame, timelineOrder: 2, startYear: 2024 },
    { project: linebot, timelineOrder: 1, startYear: 2024 }
];

const buildProjects = (lang: SupportedLang): Array<ProjectItem & { timelineOrder: number; startYear?: number }> => {
    return projectEntries
        .map(({ project, timelineOrder, startYear }) => ({
            ...project[lang],
            timelineOrder,
            startYear
        }))
        .sort((left, right) => right.timelineOrder! - left.timelineOrder!);
};

// 專案列表 - 按時間由新到舊排列
export const projects = {
    'zh-TW': buildProjects('zh-TW'),
    'en': buildProjects('en')
};
