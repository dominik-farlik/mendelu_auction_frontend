import {useEffect, useState} from "react";
import "./TimerBadge.css";
import {parseTimeDistance} from "../utils/formatDate.ts";

export default function TimerBadge({ endTime }: { endTime: string }) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [backgroundColor, setBackgroundColor] = useState<string>("");

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

            const { days, hours, minutes } = parseTimeDistance(distance);

            if (days > 1) {
                setTimeRemaining(`Aukce končí za ${days} d`);
                setBackgroundColor("black");
            } else if (days > 0) {
                setTimeRemaining(`Aukce končí za ${days} d ${hours} h`);
                setBackgroundColor("black");
            } else if (hours > 0) {
                setTimeRemaining(`Aukce končí za ${hours} h ${minutes} m`);
                setBackgroundColor("red");
            } else {
                setTimeRemaining(`Aukce končí za ${minutes} m`);
                setBackgroundColor("red");
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="timer-badge" style={{ backgroundColor: backgroundColor }}>
            {timeRemaining ? timeRemaining : "Loading..."}
        </div>
    )
}