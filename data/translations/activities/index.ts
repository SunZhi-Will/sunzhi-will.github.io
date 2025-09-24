import { digitimesHackathon } from './digitimes-hackathon';
import { taipeiDesignFestivalHackathon } from './taipei-design-festival-hackathon';
import { tedAiLecture } from './ted-ai-lecture';
import { unityCvCourse } from './unity-cv-course';

export const activities = {
    'zh-TW': {
        hackathons: {
            title: '黑客松',
            items: [
                digitimesHackathon['zh-TW'],
                taipeiDesignFestivalHackathon['zh-TW']
            ]
        },
        speaking: {
            title: '演講分享',
            items: [
                tedAiLecture['zh-TW']
            ]
        },
        teaching: {
            title: '教學活動',
            items: [
                unityCvCourse['zh-TW']
            ]
        }
    },
    'en': {
        hackathons: {
            title: 'Hackathons',
            items: [
                digitimesHackathon['en'],
                taipeiDesignFestivalHackathon['en']
            ]
        },
        speaking: {
            title: 'Speaking',
            items: [
                tedAiLecture['en']
            ]
        },
        teaching: {
            title: 'Teaching',
            items: [
                unityCvCourse['en']
            ]
        }
    }
};
