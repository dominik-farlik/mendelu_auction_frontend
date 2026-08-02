import { useState, useEffect } from 'react';
import mendelu_logo from '../../assets/Mendelova_univerzita_logo_white.png';
import './Navbar.css';
import LinkButton from "../LinkButton.tsx";
import {Link, useLocation} from "react-router-dom";
import api from '../../api/axios.ts';
import UserMenu from "./UserMenu.tsx";

export default function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        api.get('/auth/me')
            .then((response) => {
                setIsLoggedIn(true);
                setUsername(response.data.username);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, []);

    return (
        <nav className="navbar">
            <Link to="/">
                <img src={mendelu_logo} className="nav-logo" alt="MENDELU logo" />
            </Link>

            {!isAuthPage && (
                <>
                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? '✕' : '☰'}
                    </button>

                    <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                        <a href="#jak-to-funguje" className="nav-link">Jak to funguje</a>

                        {isLoggedIn ? (
                            <UserMenu username={username} onLogout={() => setIsLoggedIn(false)} />
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    <span>Přihlásit se</span>
                                </Link>
                                <Link to="/register" className="nav-link">
                                    <span>Registrace</span>
                                </Link>
                            </>
                        )}

                        <LinkButton title="Vytvořit aukci" link="/vytvorit-aukci" size="large"/>
                    </div>
                </>
            )}
        </nav>
    );
}