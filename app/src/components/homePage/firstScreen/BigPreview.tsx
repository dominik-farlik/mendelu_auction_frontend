import Tag from "../../Tag.tsx";
import BidButton from "../../BidButton.tsx";
import "./BigPreview.css";

interface Auction {
    title: string;
    description: string;
    category: string;
    startPrice: number;
    bid_count: number;
    highest_bid: number;
    organization: string;
    duration: number;
}

type BigPreviewProps = {
    index: number;
    auction: Auction;
    coverImage: string;
};

export default function BigPreview({ index, auction, coverImage }: BigPreviewProps) {
    return (
        <div key={index} className="card">
            <div className="info-container">
                <div>
                    <Tag text={`Končí za ${auction.duration} d `} />
                </div>
                <span className="large-text">{auction.title}</span>
                <div className="bid-info">
                    <div className="tag-container">
                        <Tag text="Příhozů" />
                        <span className="medium-text">{auction.bid_count}</span>
                    </div>
                    <div className="tag-container">
                        <Tag text="Nejvyšší příhoz" />
                        <span className="medium-text">{auction.highest_bid.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                </div>
                <BidButton />
            </div>
            <div className="image-container">
                <img src={coverImage} alt="Cover" />
            </div>
        </div>
    )
}