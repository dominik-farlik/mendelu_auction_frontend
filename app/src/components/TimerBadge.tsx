import { useEffect, useState, useRef } from "react";
import { parseTimeDistance } from "../utils/formatDate.ts";

interface TimerBadgeProps {
    startTime: string;
    endTime: string;
    onTimeUp?: () => void;
    style?: boolean;
}

interface BadgeInfo {
    text: string;
    color: string;
    isFinished: boolean;
}

const formatTimeText = (distance: number): string => {
    const { seconds, days, hours, minutes } = parseTimeDistance(distance);

    if (days > 1) return `${days} d`;
    if (days > 0) return `${days} d ${hours} h`;
    if (hours > 0) return `${hours} h ${minutes} m`;
    if (minutes > 0) return `${minutes} m ${seconds} s`;
    return `${seconds} s`;
};

const getBadgeInfo = (startDate: number, endDate: number): BadgeInfo => {
    const now = Date.now();
    const distanceToStart = startDate - now;
    const distanceToEnd = endDate - now;

    if (distanceToEnd < 0) {
        return { text: "Aukce skončila", color: "bg-amber-500", isFinished: true };
    }

    if (distanceToStart > 0) {
        const isPulsing = distanceToStart < 3600000; // Méně než hodina (pulzování)
        return {
            text: `Aukce začíná za ${formatTimeText(distanceToStart)}`,
            color: `bg-indigo-500 ${isPulsing ? "animate-pulse" : ""}`,
            isFinished: false
        };
    }

    const { days, hours } = parseTimeDistance(distanceToEnd);
    let color = "bg-slate-900";

    if (days === 0 && hours > 0) color = "bg-red-500";
    if (days === 0 && hours === 0) color = "bg-red-500 animate-pulse";

    return {
        text: `Aukce končí za ${formatTimeText(distanceToEnd)}`,
        color,
        isFinished: false
    };
};

export default function TimerBadge({ startTime, endTime, onTimeUp, style = true }: TimerBadgeProps) {
    const [badgeState, setBadgeState] = useState({ text: "", color: "bg-slate-900" });
    const onTimeUpCalled = useRef(false);

    useEffect(() => {
        if (!endTime || !startTime) return;

        const startTimestamp = new Date(startTime).getTime();
        const endTimestamp = new Date(endTime).getTime();

        const tick = () => {
            const info = getBadgeInfo(startTimestamp, endTimestamp);
            setBadgeState({ text: info.text, color: info.color });

            if (info.isFinished && onTimeUp && !onTimeUpCalled.current) {
                onTimeUpCalled.current = true;
                onTimeUp();
            }

            return info.isFinished;
        };

        const isDone = tick();
        if (isDone) return;

        const interval = setInterval(() => {
            if (tick()) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime, onTimeUp]);

    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm transition-colors duration-300";

    return (
        <div className={style ? `${baseClasses} ${badgeState.color}` : ""}>
            {badgeState.text || "Načítání..."}
        </div>
    );
}