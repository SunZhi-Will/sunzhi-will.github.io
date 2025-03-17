// 更新導航組件
export const NavDot = ({ active, name, onClick }: { active: boolean; name: string; onClick: () => void }) => (
    <div
        className="group flex items-center gap-4 justify-end cursor-pointer py-2 pr-2 -mr-2
                   hover:bg-primary/5 rounded-l-full transition-all duration-300"
        onClick={onClick}
    >
        <span className={`text-primary text-sm font-medium transition-all duration-300 transform
            ${active
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}
        >
            {name}
        </span>
        <div className="relative">
            <button
                className={`w-3 h-3 rounded-full transition-all duration-300 
                ${active
                        ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(253,184,19,0.5)]'
                        : 'bg-primary/40 group-hover:bg-primary/60 group-hover:shadow-[0_0_8px_rgba(253,184,19,0.3)]'}`}
            />
            {/* 裝飾性光環效果 */}
            <div className={`absolute -inset-2 rounded-full border border-primary/20
                           transition-all duration-300 transform
                           ${active
                    ? 'opacity-100 scale-125 animate-[spin_8s_linear_infinite]'
                    : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110'}`}
            />
            <div className={`absolute -inset-4 rounded-full border border-dashed border-primary/10
                           transition-all duration-300 transform
                           ${active
                    ? 'opacity-100 scale-125 animate-[spin_12s_linear_infinite_reverse]'
                    : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110'}`}
            />
        </div>
    </div>
);