import preview from "../../../assets/keramicky_hrnek-scaled.jpg"
import './SmallPreview.css';
import Tag from "../../Tag.tsx";

export default function SmallPreview() {
    return (
        <div className="small-preview">
            <div className="tag-absolute">
                <Tag text="Končí za 3 d " fill={true}/>
            </div>
            <div className="small-image-container">
                <img src={preview} alt="Náhled aukce" />
            </div>
            <div className="small-info-container">
                <span className="medium-text bold-text">Popis nabídky</span>
                <span>Nejvyšší příhoz</span>
                <span className="medium-text">1 800 Kč</span>
            </div>
        </div>
    )
}