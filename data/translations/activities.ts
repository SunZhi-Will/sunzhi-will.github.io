export const activities = {
    'zh-TW': {
        hackathons: {
            title: '黑客松',
            items: [
                {
                    title: "2025 DIGITIMES AWS 生成式 AI 黑客松",
                    description: "參加 DIGITIMES 和 AWS 合作舉辦的生成式 AI 應用黑客松，專注於開發創新的生成式 AI 解決方案",
                    category: "AI 開發",
                    achievements: [
                        "使用 AWS 生成式 AI 服務開發創新應用",
                        "整合 Amazon Bedrock 和 Anthropic Claude",
                        "實現多代理協作系統",
                        "開發多模態 AI 模型應用",
                        "建立具推理能力的大型語言模型應用"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/hackathon/digitimes2025_1.jpg", alt: "DIGITIMES AWS 黑客松團隊合照" },
                        { type: 'image' as const, src: "/projects/hackathon/digitimes2025_2.jpg", alt: "DIGITIMES AWS 黑客松競賽照片" }
                    ],
                    technologies: [
                        "AWS Bedrock",
                        "Anthropic Claude",
                        "Amazon CodeWhisperer",
                        "Amazon SageMaker",
                        "React",
                        "Node.js"
                    ]
                },
                {
                    title: "2025 雙北設計節 黑客松",
                    description: "參加台北市政府主辦的雙北設計節黑客松，專注於開發長照資料整合與儀表板組件優化",
                    category: "全端開發",
                    achievements: [
                        "開發長照數據視覺化儀表板",
                        "整合雙北市長照開放資料",
                        "優化儀表板組件效能",
                        "建立資料自動更新機制"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/hackathon/codefest2025_1.jpg", alt: "雙北設計節黑客松團隊合照" },
                        { type: 'image' as const, src: "/projects/hackathon/codefest2025_2.jpg", alt: "雙北設計節黑客松競賽照片" }
                    ],
                    technologies: [
                        "Vue.js",
                        "Docker",
                        "PostgreSQL",
                        "Node.js",
                        "TailwindCSS"
                    ]
                }
            ]
        },
        speaking: {
            title: '演講分享',
            items: [
                {
                    title: "TED × AI創新應用講座",
                    description: "受邀擔任 TED 講座講師，分享 AI 技術的創新應用與未來展望",
                    category: "演講分享",
                    achievements: [
                        "分享 AI 技術在各領域的實際應用案例",
                        "探討 AI 發展趨勢與未來機會",
                        "與聽眾互動討論 AI 創新想法"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/ted/594732_0.jpg", alt: "演講" },
                        { type: 'image' as const, src: "/projects/ted/594733_0.jpg", alt: "演講" }
                    ],
                    technologies: ["AI 應用", "ChatGPT", "NotebookLM"]
                }
            ]
        },
        teaching: {
            title: '教學活動',
            items: [
                {
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
                }
            ]
        }
    },
    'en': {
        hackathons: {
            title: 'Hackathons',
            items: [
                {
                    title: "2025 DIGITIMES AWS Generative AI Hackathon",
                    description: "Participated in the DIGITIMES and AWS Generative AI Hackathon, focusing on developing innovative AI-driven solutions",
                    category: "AI Development",
                    achievements: [
                        "Developed innovative applications using AWS Generative AI services",
                        "Integrated Amazon Bedrock and Anthropic Claude",
                        "Implemented multi-agent collaboration system",
                        "Developed multi-modal AI model applications",
                        "Built applications with reasoning-capable large language models"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/hackathon/digitimes2025_1.jpg", alt: "DIGITIMES AWS Hackathon Team Photo" },
                        { type: 'image' as const, src: "/projects/hackathon/digitimes2025_2.jpg", alt: "DIGITIMES AWS Hackathon Competition" }
                    ],
                    technologies: [
                        "AWS Bedrock",
                        "Anthropic Claude",
                        "Amazon CodeWhisperer",
                        "Amazon SageMaker",
                        "React",
                        "Node.js"
                    ]
                },
                {
                    title: "2025 Taipei Design Festival Hackathon",
                    description: "Participated in the Taipei Design Festival Hackathon, focusing on developing long-term care data integration and dashboard component optimization",
                    category: "Full Stack Development",
                    achievements: [
                        "Developed long-term care data visualization dashboard",
                        "Integrated open data from Taipei and New Taipei City",
                        "Optimized dashboard component performance",
                        "Implemented automatic data update mechanism"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/hackathon/codefest2025_1.jpg", alt: "Taipei Design Festival Hackathon Team Photo" },
                        { type: 'image' as const, src: "/projects/hackathon/codefest2025_2.jpg", alt: "Taipei Design Festival Hackathon Competition" }
                    ],
                    technologies: [
                        "Vue.js",
                        "Docker",
                        "PostgreSQL",
                        "Node.js",
                        "TailwindCSS"
                    ]
                }
            ]
        },
        speaking: {
            title: 'Speaking',
            items: [
                {
                    title: "TED × AI Innovation Applications",
                    description: "Invited as a TED speaker to share innovative AI applications and future prospects",
                    category: "Speaking",
                    achievements: [
                        "Share real-world AI application cases across various fields",
                        "Discuss AI development trends and future opportunities",
                        "Interactive discussions on AI innovation ideas"
                    ],
                    media: [
                        { type: 'image' as const, src: "/projects/ted/594732_0.jpg", alt: "Speaking" },
                        { type: 'image' as const, src: "/projects/ted/594733_0.jpg", alt: "Speaking" }
                    ],
                    technologies: ["AI Applications", "ChatGPT", "NotebookLM"]
                }
            ]
        },
        teaching: {
            title: 'Teaching',
            items: [
                {
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
            ]
        }
    }
};
