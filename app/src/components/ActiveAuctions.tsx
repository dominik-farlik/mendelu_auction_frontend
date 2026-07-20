import Filters from "./Filters.tsx";
import AuctionContainer from "./AuctionContainer.tsx";
import "./ActiveAuctions.css";

export default function ActiveAuctions() {
    return (
        <div className="active-auctions">
            <span className="large-text">AKTIVNÍ AUKCE</span>
            <div className="col-container">
                <Filters />
                <AuctionContainer />
            </div>
        </div>
    )
}