import mendelu_icon from '../../assets/Mendelu_symbol_white.png';

type ActionButtonProps = {
    title: string;
    size?: 'large' | 'medium';
    disabled?: boolean;
    onClick?: () => void;
}

export default function ActionButton({ title, size = 'large', disabled = false, onClick }: ActionButtonProps) {
    const isLarge = size === 'large';

    // Konfigurace velikostí
    const btnPadding = isLarge ? 'py-1.5 pl-1.5 pr-6' : 'py-1 pl-1 pr-4';
    const textSize = isLarge ? 'text-base' : 'text-sm';
    const gap = isLarge ? 'gap-3' : 'gap-2';

    // Konfigurace obalu ikony
    const iconWrapperSize = isLarge ? 'w-10 h-10' : 'w-8 h-8';
    const iconSize = isLarge ? 'h-5' : 'h-4';

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`
                inline-flex items-center ${gap} ${btnPadding} ${textSize}
                bg-[#4ade80] text-slate-900 font-bold rounded-full 
                shadow-sm transition-all duration-300 
                hover:shadow-lg hover:bg-[#3bcf71] active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4ade80] disabled:hover:shadow-sm
            `}
        >
            <div className={`bg-slate-900 rounded-full flex items-center justify-center shrink-0 ${iconWrapperSize}`}>
                <img
                    src={mendelu_icon}
                    alt="Mendelu symbol"
                    className={`${iconSize} w-auto object-contain`}
                />
            </div>

            <span>{title}</span>
        </button>
    );
}