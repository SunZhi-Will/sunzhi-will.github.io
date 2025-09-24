export const unityCvCourse = {
    'zh-TW': {
        title: "Unity 影像辨識課程",
        description: "在屏東科技大學碩士班擔任 Unity 結合 MediaPipe 影像辨識課程講師，分享實務經驗與技術整合",
        category: "教學分享",
        achievements: [
            "教授 Unity 與 MediaPipe 整合技術",
            "人體姿態估測在遊戲中的應用",
            "手部追蹤與手勢識別實作",
            "指導學生專案開發",
            "分享業界實務經驗"
        ],
        technologies: ["Unity", "MediaPipe", "Computer Vision", "影像辨識", "人體姿態估測"],
        media: [
            { type: 'image' as const, src: "/projects/teaching/unity-cv.png", alt: "Unity 影像辨識課程" }
        ]
    },
    'en': {
        title: "Unity Computer Vision Course",
        description: "Served as instructor for Unity with MediaPipe computer vision course at NPUST graduate school, sharing practical experience and technical integration",
        category: "Teaching",
        achievements: [
            "Teach Unity and MediaPipe integration",
            "Human pose estimation in games",
            "Hand tracking and gesture recognition",
            "Guide student projects",
            "Share industry experience"
        ],
        technologies: ["Unity", "MediaPipe", "Computer Vision", "Image Recognition", "Pose Estimation"],
        media: [
            { type: 'image' as const, src: "/projects/teaching/unity-cv.png", alt: "Unity CV Course" }
        ]
    }
};
