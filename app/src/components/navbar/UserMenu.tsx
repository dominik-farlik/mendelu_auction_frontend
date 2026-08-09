import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from "../../types/user.ts";
import { fetchUserRole } from "../../utils/role.ts";
import {useAuth} from "../../context/useAuth.ts";

export default function UserMenu() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [userRole, setUserRole] = useState<Role>(Role.Viewer);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRole().then((role) => setUserRole(role));

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white text-slate-900 rounded-full p-2 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/20 flex items-center justify-center shadow-sm"
                aria-expanded={isOpen}
                aria-label="Uživatelský účet"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
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
            </button>

            {isOpen && (
                <div className="absolute right-0 md:right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-1000 origin-top-right animate-in fade-in zoom-in-95 duration-200">

                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <strong className="block text-sm font-bold text-slate-900 truncate">
                            {`${user?.first_name} ${user?.last_name}`}
                        </strong>
                    </div>

                    <div className="flex flex-col py-2">
                        <Link
                            to="/profil/osobni-udaje"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                        >
                            Účet
                        </Link>
                        {(userRole === Role.Editor || userRole === Role.Manager) && (
                            <Link
                                to="/profil/skupiny"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                            >
                                Skupiny
                            </Link>
                        )}
                        <Link
                            to="/profil/moje-prihozy"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                        >
                            Přihozeno a sledováno
                        </Link>
                        <Link
                            to="/profil/vyhry"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                        >
                            Výhry
                        </Link>
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
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