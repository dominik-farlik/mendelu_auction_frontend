import { useState } from 'react';
import mendelu_logo_white from '../../assets/Mendelova_univerzita_logo_white.png';
import mendelu_logo_dark from '../../assets/Mendelova_univerzita_logo_black.png';
import LinkButton from "../buttons/LinkButton.tsx";
import {Link, useLocation} from "react-router-dom";
import UserMenu from "./UserMenu.tsx";
import {useAuth} from "../../context/useAuth.ts";

type NavbarProps = {
    textColor?: 'dark' | 'light';
}

export default function Navbar({ textColor = 'dark' }: NavbarProps) {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const navTextClass = textColor === 'light' ? 'text-white' : 'text-slate-900';
    const desktopTextClass = textColor === 'light' ? 'md:text-white' : 'md:text-slate-900';
    const toggleBtnClass = textColor === 'light' ? 'text-white hover:text-gray-300' : 'text-slate-900 hover:text-slate-600';
    const currentLogo = textColor === 'light' ? mendelu_logo_white : mendelu_logo_dark;

    return (
        <nav className={`relative z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center ${navTextClass}`}>
            <Link to="/" className="z-50 relative">
                <img
                    src={currentLogo}
                    className="h-12 md:h-16 w-auto object-contain hover:opacity-90 transition-opacity"
                    alt="MENDELU logo"
                />
            </Link>

            {!isAuthPage && (
                <>
                    <button
                        className={`md:hidden z-50 relative p-2 -mr-2 focus:outline-none transition-colors ${toggleBtnClass}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Přepnout menu"
                    >
                        {isOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        )}
                    </button>

                    <div className={`
                        absolute top-full left-0 w-full rounded-full bg-slate-900/95 backdrop-blur-lg border-t border-white/10 pl-4 flex flex-col gap-6 shadow-2xl transition-all duration-300 origin-top text-white
                        md:static md:w-auto md:bg-transparent md:border-none md:py-0 md:flex-row md:gap-8 md:items-center md:shadow-none md:translate-y-0 md:opacity-100 md:scale-100 ${desktopTextClass}
                        ${isOpen ? 'translate-y-0 opacity-100 scale-100 visible' : '-translate-y-4 opacity-0 scale-95 invisible md:visible'}
                    `}>
                        <a href="#jak-to-funguje" className="text-lg md:text-base font-medium hover:text-[#4ade80] transition-colors">
                            Jak to funguje
                        </a>

                        {isAuthenticated ? (
                            <div className="pt-2 md:pt-0 border-t border-white/10 md:border-none">
                                <UserMenu />
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-4 md:items-center pt-2 md:pt-0 border-t border-white/10 md:border-none">
                                <Link to="/login" className="text-lg md:text-base font-medium hover:text-[#4ade80] transition-colors">
                                    Přihlásit se
                                </Link>
                                <Link to="/register" className="text-lg md:text-base font-medium hover:text-[#4ade80] transition-colors">
                                    Registrace
                                </Link>
                            </div>
                        )}

                        <div className="pt-4 md:pt-0 w-full md:w-auto">
                            <div className="w-full sm:w-auto text-center md:text-left">
                                <LinkButton title="Vytvořit aukci" link="/vytvorit-aukci" size="large"/>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}