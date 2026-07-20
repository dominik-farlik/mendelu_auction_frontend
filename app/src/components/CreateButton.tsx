import mendelu_icon from '../assets/Mendelu_symbol_white.png';
import './CreateButton.css';

export default function CreateButton() {
    return(
        <button className="btn-create">
            <img src={mendelu_icon} alt="Mendelu symbol" />
            <span>Vytvořit aukci</span>
        </button>
    )
}