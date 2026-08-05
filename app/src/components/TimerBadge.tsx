import {useEffect, useState} from "react";
import "./TimerBadge.css";

export default function TimerBadge({ endTime }: { endTime: string }) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!endTime) return;

            const endDate = new Date(endTime).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                setTimeRemaining("Aukce skončila");
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeRemaining(`Aukce končí za ${days} d ${hours} h`);
            } else {
                setTimeRemaining(`Aukce končí za ${hours} h ${minutes} m`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="timer-badge">
            {timeRemaining ? timeRemaining : "Loading..."}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        </div>
    )
}