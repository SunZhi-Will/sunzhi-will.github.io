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

// 專案列表 - 按顯示順序排列
export const projects = {
    'zh-TW': [
        threadsSaver['zh-TW'],
        postly['zh-TW'],
        lexitechly['zh-TW'],
        coinhub['zh-TW'],
        sunui['zh-TW'],
        gformAi['zh-TW'],
        deepcrawlai['zh-TW'],
        synvize['zh-TW'],
        snapraze['zh-TW'],
        memorylane['zh-TW'],
        factory['zh-TW'],
        arGame['zh-TW'],
        vrGame['zh-TW'],
        linebot['zh-TW']
    ],
    'en': [
        threadsSaver['en'],
        postly['en'],
        lexitechly['en'],
        coinhub['en'],
        sunui['en'],
        gformAi['en'],
        deepcrawlai['en'],
        synvize['en'],
        snapraze['en'],
        memorylane['en'],
        factory['en'],
        arGame['en'],
        vrGame['en'],
        linebot['en']
    ]
};
