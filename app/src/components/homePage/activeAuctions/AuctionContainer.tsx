import SmallPreview from "./SmallPreview.tsx";
import "./AuctionContainer.css";

export default function AuctionContainer() {
    return (
        <div className="auction-container">
            <div className="auction-row">
                <SmallPreview />
                <SmallPreview />
                <SmallPreview />
            </div>
        </div>
    )
}