import { useState } from 'react';
import mendelu_logo from '../assets/Mendelova_univerzita_logo_white.png';
import './Navbar.css';
import CreateButton from "./CreateButton.tsx";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <img src={mendelu_logo} className="nav-logo" alt="MENDELU logo" />

            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <a href="#jak-to-funguje">Jak to funguje</a>
                <a href="#prihlasit">Přihlásit se</a>
                <a href="#registrace">Registrace</a>
                <CreateButton />
            </div>
        </nav>
    );
}