import mendelu_icon from '../assets/Mendelu_symbol_white.png';
import './MendeluButton.css';
import {Link} from "react-router-dom";

type LinkButtonProps = {
    title: string;
    link: string;
    size: string;
}

export default function LinkButton({ title, link, size }: LinkButtonProps) {
    return(
        <Link to={link}>
        <div className={`btn-create${size ? ` ${size}` : ""}`}>
            <img src={mendelu_icon} alt="Mendelu symbol" />
            <span>{title}</span>
        </div>
        </Link>
    )
}