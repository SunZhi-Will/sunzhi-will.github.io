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
    },
    'ja': {
        ...common['zh-TW'], // 基礎使用中文，下面會覆蓋
        nav: {
            home: 'ホーム',
            about: '私について',
            skills: 'スキル',
            projects: 'プロジェクト',
            activities: '活動',
            links: 'リンク',
            blog: 'ブログ'
        },
        categories: {
            all: 'すべて',
            programming: 'プログラミング',
            framework: 'フレームワーク',
            game: 'ゲーム開発',
            ai: 'AI技術'
        },
        hero: {
            title: 'こんにちは、私はSunです',
            subtitle: 'ソフトウェアエンジニア | AI開発 | Unity専門家',
            scrollDown: '下にスクロール'
        },
        about: {
            title: '私について',
            services: {
                title: '専門サービス',
                available: '受託可能',
                description: '要件定義からシステム実装まで、専門的な技術開発・コンサルティングサービスを提供いたします。'
            },
            teaching: {
                title: '講義コース',
                description: '大学や企業での実務経験の共有、個別指導コースを提供。基礎概念から応用まで、受講者が迅速に技術を習得できるよう支援いたします。',
                courses: [
                    'Unity ゲーム開発実践コース',
                    'Unity + MediaPipe 画像認識アプリケーション',
                    'LINE BOT 開発・実装',
                    'AI アプリケーション開発実践',
                    '学生プロジェクト指導'
                ]
            }
        },
        skills: {
            title: 'スキル'
        },
        projects: {
            title: 'プロジェクト',
            viewProject: 'プロジェクトを見る',
            mainAchievements: '主な成果：',
            video: 'ビデオ',
            liveDemo: 'ライブデモ',
            items: []
        },
        activities: {
            title: '活動と共有',
            hackathons: {
                title: 'ハッカソン',
                items: []
            },
            speaking: {
                title: '講演活動',
                items: []
            },
            teaching: {
                title: '教育活動',
                items: []
            }
        },
        footer: {
            portfolio: 'Sunのポートフォリオ',
            oldWebsite: '旧ウェブサイト'
        },
        verify: {
            loading: 'メールを検証中...',
            success: {
                title: 'メール認証成功！',
                message: 'メールアドレスをご確認いただきありがとうございます。これでニュースレターが届くようになります。'
            },
            error: {
                title: '認証失敗',
                missingParams: '必要な検証パラメータがありません',
                serviceNotConfigured: '検証サービスが設定されていません',
                verificationError: '検証中にエラーが発生しました。後でもう一度お試しください。',
                invalidLink: '無効な検証リンクまたはリンクの有効期限が切れています。'
            },
            actions: {
                backToHome: 'ホームに戻る',
                subscribeAgain: '再購読'
            }
        }
    },
    'ko': {
        ...common['zh-TW'], // 基礎使用中文，下面會覆蓋
        nav: {
            home: '홈',
            about: '소개',
            skills: '기술',
            projects: '프로젝트',
            activities: '활동',
            links: '링크',
            blog: '블로그'
        },
        categories: {
            all: '전체',
            programming: '프로그래밍',
            framework: '프레임워크',
            game: '게임 개발',
            ai: 'AI 기술'
        },
        hero: {
            title: '안녕하세요, 저는 Sun입니다',
            subtitle: '소프트웨어 엔지니어 | AI 개발 | Unity 전문가',
            scrollDown: '아래로 스크롤'
        },
        about: {
            title: '소개',
            services: {
                title: '전문 서비스',
                available: '수주 가능',
                description: '요구사항 분석부터 시스템 구현까지 전문적인 기술 개발 및 컨설팅 서비스를 제공합니다.'
            },
            teaching: {
                title: '강의 과정',
                description: '대학 및 기업에서의 실무 경험 공유, 맞춤형 강의를 제공합니다. 기초 개념부터 고급 응용까지, 수강생들이 빠르게 기술을 습득할 수 있도록 지원합니다.',
                courses: [
                    'Unity 게임 개발 실무 과정',
                    'Unity + MediaPipe 이미지 인식 애플리케이션',
                    'LINE BOT 개발 및 실무',
                    'AI 애플리케이션 개발 실무',
                    '학생 프로젝트 지도'
                ]
            }
        },
        skills: {
            title: '기술'
        },
        projects: {
            title: '프로젝트',
            viewProject: '프로젝트 보기',
            mainAchievements: '주요 성과:',
            video: '비디오',
            liveDemo: '라이브 데모',
            items: []
        },
        activities: {
            title: '활동 및 공유',
            hackathons: {
                title: '해커톤',
                items: []
            },
            speaking: {
                title: '강연 활동',
                items: []
            },
            teaching: {
                title: '교육 활동',
                items: []
            }
        },
        footer: {
            portfolio: 'Sun 포트폴리오',
            oldWebsite: '구 버전 웹사이트'
        },
        verify: {
            loading: '이메일을 확인하는 중...',
            success: {
                title: '이메일 인증 성공!',
                message: '이메일 주소를 확인해 주셔서 감사합니다. 이제 뉴스레터를 받으실 수 있습니다.'
            },
            error: {
                title: '인증 실패',
                missingParams: '필요한 인증 매개변수가 없습니다',
                serviceNotConfigured: '인증 서비스가 구성되지 않았습니다',
                verificationError: '인증 중에 오류가 발생했습니다. 나중에 다시 시도해 주세요.',
                invalidLink: '잘못된 인증 링크이거나 링크가 만료되었습니다.'
            },
            actions: {
                backToHome: '홈으로 돌아가기',
                subscribeAgain: '다시 구독하기'
            }
        }
    },
    'es': {
        ...common['zh-TW'], // 基礎使用中文，下面會覆蓋
        nav: {
            home: 'Inicio',
            about: 'Sobre mí',
            skills: 'Habilidades',
            projects: 'Proyectos',
            activities: 'Actividades',
            links: 'Enlaces',
            blog: 'Blog'
        },
        categories: {
            all: 'Todo',
            programming: 'Programación',
            framework: 'Frameworks',
            game: 'Desarrollo de juegos',
            ai: 'Tecnología AI'
        },
        hero: {
            title: 'Hola, soy Sun',
            subtitle: 'Ingeniero de Software | Desarrollador AI | Experto en Unity',
            scrollDown: 'Desplazar hacia abajo'
        },
        about: {
            title: 'Sobre mí',
            services: {
                title: 'Servicios Profesionales',
                available: 'Disponible para proyectos',
                description: 'Ofrezco servicios profesionales de desarrollo técnico y consultoría, desde el análisis de requisitos hasta la implementación del sistema.'
            },
            teaching: {
                title: 'Cursos de Enseñanza',
                description: 'Comparto experiencias prácticas en universidades y empresas, ofreciendo cursos personalizados. Desde conceptos básicos hasta aplicaciones avanzadas, ayudo a los estudiantes a dominar rápidamente las tecnologías.',
                courses: [
                    'Curso Práctico de Desarrollo de Juegos Unity',
                    'Aplicaciones de Reconocimiento de Imágenes Unity + MediaPipe',
                    'Desarrollo e Implementación de LINE BOT',
                    'Desarrollo Práctico de Aplicaciones AI',
                    'Tutoría de Proyectos Estudiantiles'
                ]
            }
        },
        skills: {
            title: 'Habilidades'
        },
        projects: {
            title: 'Proyectos',
            viewProject: 'Ver Proyecto',
            mainAchievements: 'Logros principales:',
            video: 'Video',
            liveDemo: 'Demo en vivo',
            items: []
        },
        activities: {
            title: 'Actividades y Compartir',
            hackathons: {
                title: 'Hackathons',
                items: []
            },
            speaking: {
                title: 'Actividades de Conferencias',
                items: []
            },
            teaching: {
                title: 'Actividades Educativas',
                items: []
            }
        },
        footer: {
            portfolio: 'Portafolio de Sun',
            oldWebsite: 'Sitio web anterior'
        },
        verify: {
            loading: 'Verificando tu correo electrónico...',
            success: {
                title: '¡Correo electrónico verificado exitosamente!',
                message: 'Gracias por verificar tu dirección de correo electrónico. Ahora recibirás nuestro boletín informativo.'
            },
            error: {
                title: 'Verificación fallida',
                missingParams: 'Faltan parámetros de verificación requeridos',
                serviceNotConfigured: 'Servicio de verificación no configurado',
                verificationError: 'Ocurrió un error durante la verificación. Por favor, inténtalo de nuevo más tarde.',
                invalidLink: 'Enlace de verificación inválido o el enlace ha expirado.'
            },
            actions: {
                backToHome: 'Volver al inicio',
                subscribeAgain: 'Suscribirse de nuevo'
            }
        }
    },
    'fr': {
        ...common['zh-TW'], // 基礎使用中文，下面會覆蓋
        nav: {
            home: 'Accueil',
            about: 'À propos',
            skills: 'Compétences',
            projects: 'Projets',
            activities: 'Activités',
            links: 'Liens',
            blog: 'Blog'
        },
        categories: {
            all: 'Tout',
            programming: 'Programmation',
            framework: 'Frameworks',
            game: 'Développement de jeux',
            ai: 'Technologie IA'
        },
        hero: {
            title: 'Salut, je suis Sun',
            subtitle: 'Ingénieur Logiciel | Développeur IA | Expert Unity',
            scrollDown: 'Défiler vers le bas'
        },
        about: {
            title: 'À propos de moi',
            services: {
                title: 'Services Professionnels',
                available: 'Disponible pour projets',
                description: 'Je propose des services professionnels de développement technique et de conseil, de l\'analyse des besoins à l\'implémentation système.'
            },
            teaching: {
                title: 'Cours d\'Enseignement',
                description: 'Je partage mes expériences pratiques dans les universités et entreprises, en proposant des cours personnalisés. Des concepts de base aux applications avancées, j\'aide les apprenants à maîtriser rapidement les technologies.',
                courses: [
                    'Cours Pratique de Développement de Jeux Unity',
                    'Applications de Reconnaissance d\'Images Unity + MediaPipe',
                    'Développement et Implémentation de LINE BOT',
                    'Développement Pratique d\'Applications IA',
                    'Tutorat de Projets Étudiants'
                ]
            }
        },
        skills: {
            title: 'Compétences'
        },
        projects: {
            title: 'Projets',
            viewProject: 'Voir le projet',
            mainAchievements: 'Principales réalisations :',
            video: 'Vidéo',
            liveDemo: 'Démo en direct',
            items: []
        },
        activities: {
            title: 'Activités et Partage',
            hackathons: {
                title: 'Hackathons',
                items: []
            },
            speaking: {
                title: 'Activités de Conférence',
                items: []
            },
            teaching: {
                title: 'Activités d\'Enseignement',
                items: []
            }
        },
        footer: {
            portfolio: 'Portefeuille de Sun',
            oldWebsite: 'Ancien site web'
        },
        verify: {
            loading: 'Vérification de votre email...',
            success: {
                title: 'Email vérifié avec succès !',
                message: 'Merci d\'avoir vérifié votre adresse email. Vous recevrez maintenant notre newsletter.'
            },
            error: {
                title: 'Échec de vérification',
                missingParams: 'Paramètres de vérification requis manquants',
                serviceNotConfigured: 'Service de vérification non configuré',
                verificationError: 'Une erreur s\'est produite lors de la vérification. Veuillez réessayer plus tard.',
                invalidLink: 'Lien de vérification invalide ou lien expiré.'
            },
            actions: {
                backToHome: 'Retour à l\'accueil',
                subscribeAgain: 'Se réabonner'
            }
        }
    },
    'de': {
        ...common['zh-TW'], // 基礎使用中文，下面會覆蓋
        nav: {
            home: 'Startseite',
            about: 'Über mich',
            skills: 'Fähigkeiten',
            projects: 'Projekte',
            activities: 'Aktivitäten',
            links: 'Links',
            blog: 'Blog'
        },
        categories: {
            all: 'Alle',
            programming: 'Programmierung',
            framework: 'Frameworks',
            game: 'Spieleentwicklung',
            ai: 'KI-Technologie'
        },
        hero: {
            title: 'Hallo, ich bin Sun',
            subtitle: 'Software-Ingenieur | AI-Entwickler | Unity-Experte',
            scrollDown: 'Nach unten scrollen'
        },
        about: {
            title: 'Über mich',
            services: {
                title: 'Professionelle Dienstleistungen',
                available: 'Für Projekte verfügbar',
                description: 'Ich biete professionelle technische Entwicklungs- und Beratungsdienstleistungen an, von der Anforderungsanalyse bis zur Systemimplementierung.'
            },
            teaching: {
                title: 'Lehrveranstaltungen',
                description: 'Ich teile meine praktischen Erfahrungen in Universitäten und Unternehmen und biete maßgeschneiderte Kurse an. Von grundlegenden Konzepten bis zu fortgeschrittenen Anwendungen unterstütze ich Lernende dabei, Technologien schnell zu beherrschen.',
                courses: [
                    'Praktischer Unity-Spielentwicklungskurs',
                    'Unity + MediaPipe Bilderkennungsanwendungen',
                    'LINE BOT Entwicklung und Implementierung',
                    'Praktische KI-Anwendungsentwicklung',
                    'Betreuung von Studentenprojekten'
                ]
            }
        },
        skills: {
            title: 'Fähigkeiten'
        },
        projects: {
            title: 'Projekte',
            viewProject: 'Projekt ansehen',
            mainAchievements: 'Haupterfolge:',
            video: 'Video',
            liveDemo: 'Live-Demo',
            items: []
        },
        activities: {
            title: 'Aktivitäten und Teilen',
            hackathons: {
                title: 'Hackathons',
                items: []
            },
            speaking: {
                title: 'Vortragsaktivitäten',
                items: []
            },
            teaching: {
                title: 'Bildungsaktivitäten',
                items: []
            }
        },
        footer: {
            portfolio: 'Suns Portfolio',
            oldWebsite: 'Alte Website'
        },
        verify: {
            loading: 'E-Mail wird überprüft...',
            success: {
                title: 'E-Mail erfolgreich verifiziert!',
                message: 'Vielen Dank für die Verifizierung Ihrer E-Mail-Adresse. Sie erhalten jetzt unseren Newsletter.'
            },
            error: {
                title: 'Verifizierung fehlgeschlagen',
                missingParams: 'Erforderliche Verifizierungsparameter fehlen',
                serviceNotConfigured: 'Verifizierungsdienst nicht konfiguriert',
                verificationError: 'Während der Verifizierung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
                invalidLink: 'Ungültiger Verifizierungslink oder Link ist abgelaufen.'
            },
            actions: {
                backToHome: 'Zurück zur Startseite',
                subscribeAgain: 'Erneut abonnieren'
            }
        }
    }
}; 
