const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

export type TechCategoryKey = 'programming' | 'framework' | 'game' | 'ai' | 'other';

export const techStacks: Array<{
    category: TechCategoryKey;
    items: Array<{ name: string; icon: string }>;
}> = [
    {
        category: 'programming',
        items: [
            { name: 'C#', icon: `${DEVICON}/csharp/csharp-original.svg` },
            { name: 'Python', icon: `${DEVICON}/python/python-original.svg` },
            { name: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg` },
            { name: 'TypeScript', icon: `${DEVICON}/typescript/typescript-original.svg` },
            { name: 'Java', icon: `${DEVICON}/java/java-original.svg` }
        ]
    },
    {
        category: 'framework',
        items: [
            { name: '.NET', icon: `${DEVICON}/dotnetcore/dotnetcore-original.svg` },
            { name: 'React', icon: `${DEVICON}/react/react-original.svg` },
            { name: 'Next.js', icon: `${DEVICON}/nextjs/nextjs-original.svg` },
            { name: 'Tailwind CSS', icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
            { name: 'Vue.js', icon: `${DEVICON}/vuejs/vuejs-original.svg` },
            { name: 'Flutter', icon: `${DEVICON}/flutter/flutter-original.svg` }
        ]
    },
    {
        category: 'game',
        items: [
            { name: 'Unity', icon: `${DEVICON}/unity/unity-original.svg` }
        ]
    },
    {
        category: 'ai',
        items: [
            { name: 'Azure OpenAI', icon: `${DEVICON}/azure/azure-original.svg` },
            { name: 'Gemini', icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
            { name: 'Computer Vision', icon: `${DEVICON}/opencv/opencv-original.svg` },
            { name: 'MediaPipe', icon: '/icons/mediapipe-logo.png' }
        ]
    },
    {
        category: 'other',
        items: [
            { name: 'SQL Server', icon: `${DEVICON}/microsoftsqlserver/microsoftsqlserver-plain.svg` },
            { name: 'Git', icon: `${DEVICON}/git/git-original.svg` },
            { name: 'Docker', icon: `${DEVICON}/docker/docker-original.svg` }
        ]
    }
];
