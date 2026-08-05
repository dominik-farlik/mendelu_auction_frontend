import { useEffect, useState } from "react";
import { parseTimeDistance } from "../utils/formatDate.ts";

export default function TimerBadge({ endTime }: { endTime: string }) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    // Místo konkrétní barvy ukládáme rovnou Tailwind třídu
    const [colorClass, setColorClass] = useState<string>("bg-slate-900");

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!endTime) return;

            const endDate = new Date(endTime).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                setTimeRemaining("Aukce skončila");
                setColorClass("bg-gray-500"); // Pro skončenou aukci se hodí neutrální šedá
                return;
            }

            const { days, hours, minutes } = parseTimeDistance(distance);

            if (days > 1) {
                setTimeRemaining(`Aukce končí za ${days} d`);
                setColorClass("bg-slate-900");
            } else if (days > 0) {
                setTimeRemaining(`Aukce končí za ${days} d ${hours} h`);
                setColorClass("bg-slate-900");
            } else if (hours > 0) {
                setTimeRemaining(`Aukce končí za ${hours} h ${minutes} m`);
                setColorClass("bg-red-500");
            } else {
                setTimeRemaining(`Aukce končí za ${minutes} m`);
                setColorClass("bg-red-500 animate-pulse"); // U posledních minut můžeme přidat pulzování
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm transition-colors duration-300 ${colorClass}`}>
            {timeRemaining ? timeRemaining : "Načítání..."}
        </div>
    );
}