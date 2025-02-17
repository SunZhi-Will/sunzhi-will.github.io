// 更新導航組件
export const NavDot = ({ active, name, onClick }: { active: boolean; name: string; onClick: () => void }) => (
    <div className="group flex items-center gap-4 justify-end">
        <span className={`text-blue-300 text-sm transition-all duration-300
        ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {name}
        </span>
        <button
            onClick={onClick}
            className={`w-3 h-3 rounded-full transition-all duration-300 
          ${active ? 'bg-blue-400 scale-125' : 'bg-blue-400/40 hover:bg-blue-400/60'}`}
        />
    </div>
);