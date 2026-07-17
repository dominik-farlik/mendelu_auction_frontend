import { useState } from 'react';
import mendelu_logo from '../assets/Mendelova_univerzita_logo_white.png';
import mendelu_icon from '../assets/Mendelu_symbol_white.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <img src={mendelu_logo} className="nav-logo" alt="MENDELU logo" />

            {/* Tlačítko viditelné jen na mobilu */}
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Menu - třída 'active' se přidá po kliknutí na mobilu */}
            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <a href="#jak-to-funguje">Jak to funguje</a>
                <a href="#prihlasit">Přihlásit se</a>
                <a href="#registrace">Registrace</a>

                <button className="btn-create">
                    <img src={mendelu_icon} alt="Mendelu symbol" />
                    <span>Vytvořit aukci</span>
                </button>
            </div>
        </nav>
    );
}