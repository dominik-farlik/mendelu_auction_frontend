import { useEffect, useState } from "react";
import { parseTimeDistance } from "../../utils/formatDate.ts";

// Termín celé akce (listopad = středoevropský čas, UTC+1).
const EVENT_START = new Date("2026-11-21T08:00:00+01:00").getTime();
const EVENT_END = new Date("2026-11-27T20:00:00+01:00").getTime();

type Phase = "before" | "running" | "after";

function getPhase(now: number): Phase {
    if (now < EVENT_START) return "before";
    if (now < EVENT_END) return "running";
    return "after";
}

function DateBlock({ label, day, date, time }: { label: string; day: string; date: number; time: string }) {
    return (
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center leading-none">
                <span className="text-xl sm:text-2xl font-black text-white">{date}.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">listopad</span>
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-[#4ade80] uppercase tracking-[0.2em]">{label}</span>
                <span className="text-base sm:text-lg font-black text-white leading-tight whitespace-nowrap">
                    {day} {time}
                </span>
            </div>
        </div>
    );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center min-w-12">
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">
                {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{label}</span>
        </div>
    );
}

/** Termín akce pod bannerem na hlavní stránce, s odpočtem do začátku nebo do konce. */
export default function EventDates() {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const phase = getPhase(now);
    const target = phase === "before" ? EVENT_START : EVENT_END;
    const { days, hours, minutes, seconds } = parseTimeDistance(Math.max(0, target - now));
    const progress = Math.min(1, Math.max(0, (now - EVENT_START) / (EVENT_END - EVENT_START)));

    const status = {
        before: "Aukce začne za",
        running: "Aukce právě probíhá, končí za",
        after: "Aukce skončila. Děkujeme všem, kteří přispěli!",
    }[phase];

    return (
        <div className="relative -mt-10 md:-mt-36 mx-3 sm:mx-6 bg-slate-800/85 border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 md:p-5 flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    <DateBlock label="Začátek" day="Sobota" date={21} time="8:00" />
                    <svg className="hidden sm:block w-6 h-6 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                    <DateBlock label="Konec" day="Pátek" date={27} time="20:00" />
                </div>

                <div className="shrink-0 lg:border-l lg:border-white/10 lg:pl-6 flex flex-col gap-3 pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0">
                    <span className="text-sm font-semibold text-slate-300">{status}</span>
                    {phase !== "after" && (
                        <div className="flex items-start gap-1 sm:gap-2" aria-live="off">
                            <CountdownUnit value={days} label="dní" />
                            <span className="text-2xl font-black text-slate-600 leading-none">:</span>
                            <CountdownUnit value={hours} label="hod" />
                            <span className="text-2xl font-black text-slate-600 leading-none">:</span>
                            <CountdownUnit value={minutes} label="min" />
                            <span className="text-2xl font-black text-slate-600 leading-none">:</span>
                            <CountdownUnit value={seconds} label="sek" />
                        </div>
                    )}
                </div>
            </div>

            {phase === "running" && (
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
                    <div className="h-full rounded-full bg-[#4ade80] transition-[width] duration-1000" style={{ width: `${progress * 100}%` }}></div>
                </div>
            )}
        </div>
    );
}
