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
            title: '私について'
        },
        skills: {
            title: 'スキル'
        },
        projects: {
            title: 'プロジェクト',
            viewProject: 'プロジェクトを見る',
            mainAchievements: '主な成果：',
            video: 'ビデオ',
            liveDemo: 'ライブデモ'
        },
        activities: {
            title: '活動と共有'
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
            title: '소개'
        },
        skills: {
            title: '기술'
        },
        projects: {
            title: '프로젝트',
            viewProject: '프로젝트 보기',
            mainAchievements: '주요 성과:',
            video: '비디오',
            liveDemo: '라이브 데모'
        },
        activities: {
            title: '활동 및 공유'
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
            title: 'Sobre mí'
        },
        skills: {
            title: 'Habilidades'
        },
        projects: {
            title: 'Proyectos',
            viewProject: 'Ver Proyecto',
            mainAchievements: 'Logros principales:',
            video: 'Video',
            liveDemo: 'Demo en vivo'
        },
        activities: {
            title: 'Actividades y Compartir'
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
            title: 'À propos de moi'
        },
        skills: {
            title: 'Compétences'
        },
        projects: {
            title: 'Projets',
            viewProject: 'Voir le projet',
            mainAchievements: 'Principales réalisations :',
            video: 'Vidéo',
            liveDemo: 'Démo en direct'
        },
        activities: {
            title: 'Activités et Partage'
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
            title: 'Über mich'
        },
        skills: {
            title: 'Fähigkeiten'
        },
        projects: {
            title: 'Projekte',
            viewProject: 'Projekt ansehen',
            mainAchievements: 'Haupterfolge:',
            video: 'Video',
            liveDemo: 'Live-Demo'
        },
        activities: {
            title: 'Aktivitäten und Teilen'
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
