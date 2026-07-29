import mendelu_icon from '../assets/Mendelu_symbol_white.png';
import './MendeluButton.css';

type SubmitButtonProps = {
    title: string;
    size: string;
    disabled?: boolean;
    cursor?: string;
}

export default function SubmitButton({ title, size, disabled = false, cursor = "pointer" }: SubmitButtonProps) {
    return(
        <button
            type="submit"
            className={`btn-create${size ? ` ${size}` : ""}`}
            disabled={disabled}
            style = {{ cursor: `${cursor}` }}
        >
            <img src={mendelu_icon} alt="Mendelu symbol" />
            <span>{title}</span>
        </button>
    )
}