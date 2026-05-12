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
};

type LocalizedProject = Record<SupportedLang, Omit<ProjectItem, 'timelineOrder'>>;

type ProjectEntry = {
    project: LocalizedProject;
    timelineOrder: number;
};

const projectEntries: ProjectEntry[] = [
    { project: nexusos, timelineOrder: 41 },
    { project: openring, timelineOrder: 40 },
    { project: broadvize, timelineOrder: 39 },
    { project: threado, timelineOrder: 38 },
    { project: skyvize, timelineOrder: 37 },
    { project: resumeai, timelineOrder: 36 },
    { project: codeltp, timelineOrder: 35 },
    { project: aiDebtScanner, timelineOrder: 34 },
    { project: vibegame, timelineOrder: 33 },
    { project: voxelWorld, timelineOrder: 32 },
    { project: allvibe, timelineOrder: 31 },
    { project: ticktive, timelineOrder: 30 },
    { project: threadsStoryRecap, timelineOrder: 29 },
    { project: cardflow, timelineOrder: 28 },
    { project: veyoShop, timelineOrder: 27 },
    { project: promptly, timelineOrder: 26 },
    { project: fliptok, timelineOrder: 25 },
    { project: liminal, timelineOrder: 24 },
    { project: taipeiCityDashboard, timelineOrder: 23 },
    { project: vibeacademy, timelineOrder: 22 },
    { project: vibeWorkshop, timelineOrder: 21 },
    { project: autolens, timelineOrder: 20 },
    { project: specformula, timelineOrder: 19 },
    { project: zettelify, timelineOrder: 18 },
    { project: toolnest, timelineOrder: 17 },
    { project: ithomeHelper, timelineOrder: 16 },
    { project: threadsSaver, timelineOrder: 15 },
    { project: postly, timelineOrder: 14 },
    { project: lexitechly, timelineOrder: 13 },
    { project: coinhub, timelineOrder: 12 },
    { project: sunui, timelineOrder: 11 },
    { project: gformAi, timelineOrder: 10 },
    { project: deepcrawlai, timelineOrder: 9 },
    { project: synvize, timelineOrder: 8 },
    { project: snapraze, timelineOrder: 7 },
    { project: memorylane, timelineOrder: 6 },
    { project: factory, timelineOrder: 5 },
    { project: carbon, timelineOrder: 4 },
    { project: arGame, timelineOrder: 3 },
    { project: vrGame, timelineOrder: 2 },
    { project: linebot, timelineOrder: 1 }
];

const buildProjects = (lang: SupportedLang) => {
    return projectEntries
        .map(({ project, timelineOrder }) => ({
            ...project[lang],
            timelineOrder
        }))
        .sort((left, right) => right.timelineOrder! - left.timelineOrder!);
};

// 專案列表 - 按時間由新到舊排列
export const projects = {
    'zh-TW': buildProjects('zh-TW'),
    'en': buildProjects('en')
};
