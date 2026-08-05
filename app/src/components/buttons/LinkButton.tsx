import mendelu_icon from '../../assets/Mendelu_symbol_white.png';
import { Link } from "react-router-dom";

type LinkButtonProps = {
    title: string;
    link: string;
    size?: 'large' | 'medium'; // Doplněny konkrétní povolené hodnoty
}

export default function LinkButton({ title, link, size = 'large' }: LinkButtonProps) {
    const isLarge = size === 'large';

    // Konfigurace velikostí pomocí Tailwind tříd
    // Všimněte si asymetrického paddingu (pl-1.5 pr-6), protože nalevo je kulatá ikonka
    const btnPadding = isLarge ? 'py-1.5 pl-1.5 pr-6' : 'py-1 pl-1 pr-4';
    const textSize = isLarge ? 'text-base' : 'text-sm';
    const gap = isLarge ? 'gap-3' : 'gap-2';

    // Konfigurace obalu ikony a samotného obrázku
    const iconWrapperSize = isLarge ? 'w-10 h-10' : 'w-8 h-8';
    const iconSize = isLarge ? 'h-5' : 'h-4';

    return (
        <Link
            to={link}
            className={`
                inline-flex items-center ${gap} ${btnPadding} ${textSize}
                bg-[#4ade80] text-slate-900 font-bold rounded-full 
                shadow-sm hover:shadow-lg hover:bg-[#3bcf71] 
                transition-all duration-300 active:scale-95
            `}
        >
            {/* Tmavý kroužek kolem bílé ikonky */}
            <div className={`bg-slate-900 rounded-full flex items-center justify-center shrink-0 ${iconWrapperSize}`}>
                <img
                    src={mendelu_icon}
                    alt="Mendelu symbol"
                    className={`${iconSize} w-auto object-contain`}
                />
            </div>

            <span>{title}</span>
        </Link>
    );
}