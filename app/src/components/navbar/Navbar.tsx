import { useState, useEffect } from 'react';
import mendelu_logo from '../../assets/Mendelova_univerzita_logo_white.png';
import './Navbar.css';
import CreateButton from "./CreateButton.tsx";
import { Link } from "react-router-dom";
import api from '../../api/axios.ts';
import UserMenu from "./UserMenu.tsx";

export default function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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

            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <a href="#jak-to-funguje">Jak to funguje</a>

                {isLoggedIn === true ? (
                    <UserMenu username={username} onLogout={() => setIsLoggedIn(false)} />
                ) : isLoggedIn === false ? (
                    <>
                        <Link to="/login">
                            <span>Přihlásit se</span>
                        </Link>
                        <Link to="/register">
                            <span>Registrace</span>
                        </Link>
                    </>
                ) : null}

                <CreateButton />
            </div>
        </nav>
    );
}