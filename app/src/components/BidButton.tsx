import './BidButton.css';

export default function BidButton() {
    return (
        <div>
            <button className="btn-bid">
                <div className="bid-icon">▲</div>
                <span style={{ padding: "0 10px" }}>Přihodit</span>
            </button>
        </div>
    )
}