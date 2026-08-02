import { useState, useRef, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import api from '../../api/axios.ts';
import './UserMenu.css';
import {Role} from "../../types/user.ts";
import {fetchUserRole} from "../../utils/role.ts";

type UserMenuProps = {
    username: string | null;
    onLogout?: () => void;
};

export default function UserMenu({ username, onLogout }: UserMenuProps) {
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
        try {
            await api.post('/auth/logout');
            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Chyba při odhlašování:', error);
        } finally {
            navigate("/")
        }
    };

    return (
        <div className="user-menu-container" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav-user-icon-link"
                aria-expanded={isOpen}
                aria-label="Uživatelský účet"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="nav-user-icon"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>

            {/* Rozbalovací menu */}
            {isOpen && (
                <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                        <strong>{username || 'Uživatel'}</strong>
                    </div>
                    <div className="user-dropdown-links">
                        <Link to="/profil/osobni-udaje" onClick={() => setIsOpen(false)}>
                            Účet
                        </Link>
                        {(userRole === Role.Editor || userRole === Role.Manager) &&
                            <Link to="/profil/skupiny" onClick={() => setIsOpen(false)}>
                                Skupiny
                            </Link>
                        }
                        <Link to="/profil/moje-prihozy" onClick={() => setIsOpen(false)}>
                            Přihozeno a sledováno
                        </Link>
                        <Link to="/profil/moje-prihozy" onClick={() => setIsOpen(false)}>
                            Výhry
                        </Link>
                    </div>
                    <div className="user-dropdown-footer">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="logout-button"
                        >
                            Odhlásit se
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}