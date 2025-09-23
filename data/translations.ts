import { Translations } from '../types';
import { common } from './translations/common';
import { projects } from './translations/projects';
import { activities } from './translations/activities';

export const translations: Translations = {
    'zh-TW': {
        ...common['zh-TW'],
        projects: {
            ...common['zh-TW'].projects,
            items: projects['zh-TW']
        },
        activities: {
            ...common['zh-TW'].activities,
            ...activities['zh-TW']
        } as any
    },
    'en': {
        ...common['en'],
        projects: {
            ...common['en'].projects,
            items: projects['en']
        },
        activities: {
            ...common['en'].activities,
            ...activities['en']
        } as any
    }
}; 
