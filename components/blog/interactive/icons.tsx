import type { ComponentType, SVGProps } from 'react';
import {
    ArchiveBoxIcon,
    ArrowDownIcon,
    BoltIcon,
    BriefcaseIcon,
    BuildingOffice2Icon,
    CircleStackIcon,
    ClockIcon,
    CloudIcon,
    Cog6ToothIcon,
    CommandLineIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    FireIcon,
    FolderIcon,
    GlobeAltIcon,
    IdentificationIcon,
    KeyIcon,
    LockClosedIcon,
    MapPinIcon,
    RocketLaunchIcon,
    ScaleIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    SparklesIcon,
    TrashIcon,
    UserCircleIcon,
    UserIcon,
    XCircleIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, HeartIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/solid';

type IconProps = SVGProps<SVGSVGElement>;

/** React 的原子圖形 */
function ReactAtom(props: IconProps) {
    return (
        <svg viewBox="-12 -12 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" {...props}>
            <circle r="1.8" fill="currentColor" stroke="none" />
            <ellipse rx="10" ry="4" />
            <ellipse rx="10" ry="4" transform="rotate(60)" />
            <ellipse rx="10" ry="4" transform="rotate(120)" />
        </svg>
    );
}

/** Next.js 的三角形 */
function NextTriangle(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12 3 22 20H2z" />
        </svg>
    );
}

const ICONS = {
    user: UserIcon,
    avatar: UserCircleIcon,
    monitor: ComputerDesktopIcon,
    phone: DevicePhoneMobileIcon,
    server: ServerStackIcon,
    db: CircleStackIcon,
    cog: Cog6ToothIcon,
    key: KeyIcon,
    shield: ShieldCheckIcon,
    mail: EnvelopeIcon,
    trash: TrashIcon,
    scale: ScaleIcon,
    id: IdentificationIcon,
    briefcase: BriefcaseIcon,
    folder: FolderIcon,
    box: ArchiveBoxIcon,
    cloud: CloudIcon,
    globe: GlobeAltIcon,
    bolt: BoltIcon,
    rocket: RocketLaunchIcon,
    lock: LockClosedIcon,
    pin: MapPinIcon,
    doc: DocumentTextIcon,
    building: BuildingOffice2Icon,
    warn: ExclamationTriangleIcon,
    dead: XCircleIcon,
    code: CommandLineIcon,
    bag: ShoppingBagIcon,
    clock: ClockIcon,
    fire: FireIcon,
    spark: SparklesIcon,
    photo: PhotoIcon,
    check: CheckIcon,
    x: XMarkIcon,
    play: PlayIcon,
    heart: HeartIcon,
    down: ArrowDownIcon,
    react: ReactAtom,
    next: NextTriangle,
} satisfies Record<string, ComponentType<IconProps>>;

export type IconName = keyof typeof ICONS;

/** 文章互動元件共用的向量圖示，顏色跟著文字色走 */
export function Icon({ name, className = 'h-5 w-5', ...rest }: { name: IconName; className?: string } & IconProps) {
    const Component = ICONS[name];
    return <Component aria-hidden="true" className={className} {...rest} />;
}
