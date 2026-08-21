import { useEffect, useState } from "react";
import { parseTimeDistance } from "../utils/formatDate.ts";

interface TimerBadgeProps {
    endTime: string;
    onTimeUp?: () => void;
    style?: boolean;
}

export default function TimerBadge({ endTime, onTimeUp, style = true }: TimerBadgeProps) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [colorClass, setColorClass] = useState<string>("bg-slate-900");

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        let isFinished = false;

        const calculateTimeLeft = () => {
            if (!endTime) return;

            const endDate = new Date(endTime).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                setTimeRemaining("Aukce skončila");
                setColorClass("bg-amber-500");

                if (onTimeUp && !isFinished) {
                    isFinished = true;
                    onTimeUp();
                }

                clearInterval(interval);
                return;
            }

            const { seconds, days, hours, minutes } = parseTimeDistance(distance);

            if (days > 1) {
                setTimeRemaining(`Aukce končí za ${days} d`);
                setColorClass("bg-slate-900");
            } else if (days > 0) {
                setTimeRemaining(`Aukce končí za ${days} d ${hours} h`);
                setColorClass("bg-slate-900");
            } else if (hours > 0) {
                setTimeRemaining(`Aukce končí za ${hours} h ${minutes} m`);
                setColorClass("bg-red-500");
            } else if (minutes > 0) {
                setTimeRemaining(`Aukce končí za ${minutes} m ${seconds} s`);
                setColorClass("bg-red-500 animate-pulse");
            } else {
                setTimeRemaining(`Aukce končí za ${seconds} s`);
                setColorClass("bg-red-500 animate-pulse");
            }

            const nextUpdateInterval = distance < 3600000 ? 1000 : 60000;
            clearInterval(interval);
            interval = setInterval(calculateTimeLeft, nextUpdateInterval);
        };

        calculateTimeLeft();
        return () => clearInterval(interval);
    }, [endTime, onTimeUp]);

    return (
        <div className={style ? (`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm transition-colors duration-300 ${colorClass}`) : ""}>
            {timeRemaining ? timeRemaining : "Načítání..."}
        </div>
    );
}