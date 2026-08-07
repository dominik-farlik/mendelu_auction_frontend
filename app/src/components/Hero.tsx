import React from "react";
import Navbar from "./navbar/Navbar.tsx";

export default function Hero({children, navbarTextColor}: { children: React.ReactNode, navbarTextColor?: "dark" | "light" | undefined}) {
    return (
        <div className="min-h-screen pb-20 md:pb-28 rounded-b-[2.5rem] md:rounded-b-4xl relative overflow-hidden shadow-sm bg-linear-to-br from-slate-950 via-[#151b2b] to-blue-950 text-white">
            <Navbar textColor={navbarTextColor}/>
            {children}
        </div>
        )
}