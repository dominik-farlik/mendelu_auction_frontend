import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from "../../types/user.ts";
import {useAuth} from "../../context/useAuth.ts";
import type { UserResponse } from "../../api/userService.ts";

type UserMenuProps = {
    /** "dropdown" = ikona s rozbalovací nabídkou (desktop), "inline" = seznam přímo v mobilním menu. */
    variant?: "dropdown" | "inline";
    /** Zavolá se po výběru položky (mobilní menu se tím zavře). */
    onNavigate?: () => void;
};

type MenuLink = { to: string; label: string };

function getMenuLinks(user: UserResponse | null): MenuLink[] {
    const role = user?.role.name;
    const canManageGroups = role === Role.Editor || role === Role.Manager;
    return [
        { to: "/profil/osobni-udaje", label: "Účet" },
        ...(canManageGroups ? [{ to: "/profil/skupiny", label: "Skupiny" }] : []),
        { to: "/profil/moje-prihozy", label: "Přihozeno a sledováno" },
        { to: "/profil/vyhry", label: "Výhry" },
        ...(role === Role.Manager ? [{ to: "/profil/sprava-uzivatelu", label: "Správa uživatelů" }] : []),
    ];
}

function UserIcon({ size = 22 }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    );
}

export default function UserMenu({ variant = "dropdown", onNavigate }: UserMenuProps) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const links = getMenuLinks(user);
    const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

    useEffect(() => {
        if (variant !== "dropdown") return;
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [variant]);

    const close = () => {
        setIsOpen(false);
        onNavigate?.();
    };

    const handleLogout = async () => {
        close();
        await logout();
        navigate("/");
    };

    if (variant === "inline") {
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 pb-3">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
                        <UserIcon size={20} />
                    </span>
                    <strong className="text-base font-bold text-white truncate">{fullName}</strong>
                </div>

                <nav className="flex flex-col" aria-label="Uživatelský účet">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={close}
                            className="py-2.5 text-base font-medium text-slate-200 hover:text-[#4ade80] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-4 py-3 text-base font-bold text-white border-2 border-white/30 rounded-xl hover:bg-white hover:text-slate-900 transition-colors"
                >
                    Odhlásit se
                </button>
            </div>
        );
    }

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white text-slate-900 rounded-full p-2 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/20 flex items-center justify-center shadow-sm"
                aria-expanded={isOpen}
                aria-label="Uživatelský účet"
            >
                <UserIcon />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-1000 origin-top-right animate-in fade-in zoom-in-95 duration-200">

                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <strong className="block text-sm font-bold text-slate-900 truncate">
                            {fullName}
                        </strong>
                    </div>

                    <div className="flex flex-col py-2">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={close}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 bg-transparent border-2 border-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            Odhlásit se
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
