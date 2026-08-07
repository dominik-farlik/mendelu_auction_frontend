import React from "react";
import Navbar from "./navbar/Navbar.tsx";

export default function Hero({children, navbarTextColor}: { children: React.ReactNode, navbarTextColor?: "dark" | "light" | undefined}) {
    const scrollToNextSection = () => {
        window.scrollBy({
            top: window.innerHeight - 100,
            behavior: "smooth"
        });
    };

    return (
        <div className="min-h-screen pb-20 md:pb-28 rounded-b-[2.5rem] md:rounded-b-4xl relative overflow-hidden shadow-sm bg-linear-to-br from-slate-950 via-[#151b2b] to-blue-950 text-white">
            <Navbar textColor={navbarTextColor}/>

            {children}

            <button
                onClick={scrollToNextSection}
                className="absolute bottom-2 md:bottom-2 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors duration-300 animate-bounce cursor-pointer p-3 rounded-full hover:bg-white/5"
                aria-label="Posunout níže"
                title="Posunout níže"
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
        </div>
    )
}