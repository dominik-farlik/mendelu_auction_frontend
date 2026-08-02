import mendelu_icon from '../assets/Mendelu_symbol_white.png';
import './MendeluButton.css';

type ActionButtonProps = {
    title: string;
    size: string;
    disabled?: boolean;
    cursor?: string;
    onClick?: () => void;
}

export default function ActionButton({ title, size, disabled = false, cursor = "pointer", onClick }: ActionButtonProps) {
    return(
        <button
            className={`btn-create${size ? ` ${size}` : ""}`}
            disabled={disabled}
            style = {{ cursor: `${cursor}` }}
            onClick={onClick}
        >
            <img src={mendelu_icon} alt="Mendelu symbol" />
            <span>{title}</span>
        </button>
    )
}