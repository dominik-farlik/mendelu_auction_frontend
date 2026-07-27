import { useState, useEffect } from 'react';
import mendelu_logo from '../assets/Mendelova_univerzita_logo_white.png';
import './Navbar.css';
import CreateButton from "./CreateButton.tsx";
import { Link } from "react-router-dom";
import api from '../api/axios.ts';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = načítá se

    useEffect(() => {
        api.get('/auth/me')
            .then(() => {
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, []);

    return (
        <nav className="navbar">
            <img src={mendelu_logo} className="nav-logo" alt="MENDELU logo" />

            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <a href="#jak-to-funguje">Jak to funguje</a>

                {isLoggedIn === true ? (
                    <Link to="/profile" title="Můj účet" className="nav-user-icon-link">
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
                    </Link>
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