type MenuButtonProps = {
    title: string;
    windowName: string;
    active: boolean;
    handleTabChange: (windowName: string) => void;
};

export default function MenuButton({ title, windowName, active, handleTabChange }: MenuButtonProps) {
    return (
        <button
            className={`
                group w-full text-left px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between
                ${active
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900"
            }
            `}
            onClick={() => handleTabChange(windowName)}
        >
            <span>{title}</span>

            <svg
                className={`w-4 h-4 transition-all duration-300 
                    ${active
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400"
                }
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}