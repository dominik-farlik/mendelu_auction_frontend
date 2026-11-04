export default function ProfileStat({ label, value, unit }: { label: string, value: string, unit?: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col gap-3">
            <h2 className="text-sm md:text-base font-black uppercase tracking-tight text-gray-300 m-0">{label}</h2>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl md:text-6xl font-black text-[#4ade80] leading-none">{value}</span>
                {unit && <span className="text-xl font-bold text-gray-300">{unit}</span>}
            </div>
        </div>
    );
}
