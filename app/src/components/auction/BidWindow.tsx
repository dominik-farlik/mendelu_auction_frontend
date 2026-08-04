import './BidWindow.css';
import {useEffect, useState} from "react";
import {type ProductBids, type ProductResponse, productService} from "../../api/productService.ts";
import { Status } from "../../types/product.ts";
import {userService} from "../../api/userService.ts";

export default function BidWindow({ product, bidsData }: { product: ProductResponse, bidsData: ProductBids[] }) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentPrice = bidsData && bidsData.length > 0
        ? Math.max(...bidsData.map(b => b.amount))
        : product.starting_price;

    const minNextBid = currentPrice + (product.min_bid || 0);

    const [bidAmount, setBidAmount] = useState<number | "">(minNextBid);

    useEffect(() => {
        setBidAmount((prevBid) => {
            // Only overwrite the input if it's empty, or if the user's
            // current typed amount is no longer a valid (winning) bid.
            if (prevBid === "" || prevBid < minNextBid) {
                return minNextBid;
            }
            return prevBid;
        });
    }, [minNextBid]); // Depend on the calculated value, not just bidsData

    // Výpočet zbývajícího času do konce aukce
    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!product.ends_at) return;

            const endDate = new Date(product.ends_at).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                setTimeRemaining("Auction ended");
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeRemaining(`ends in ${days} d ${hours} h`);
            } else {
                setTimeRemaining(`ends in ${hours} h ${minutes} m`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(interval);
    }, [product.ends_at]);

    // Odeslání příhozu
    const handleBidSubmit = async () => {
        if (!bidAmount || bidAmount <= currentPrice) {
            setError(`Příhoz musí být vyšší než ${minNextBid} Kč`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await userService.bid(product.id, Number(bidAmount));
            await productService.getProductBids(product.id);
            setBidAmount(""); // Vyčištění inputu
            // Zde by ideálně mohla být i notifikace o úspěchu (např. toast)
        } catch (err: any) {
            setError(err.response?.data?.message || "Došlo k chybě při příhozu.");
        } finally {
            setIsLoading(false);
        }
    };

    const formattedCurrentPrice = currentPrice?.toLocaleString('cs-CZ');

    return (
        <div className="bid-window-card">
            {/* HORNÍ NAVIGACE A SLEDOVÁNÍ */}
            <div className="bid-window-header">
                <div className="bid-tabs">
                    <button className="tab-btn active">Aukce</button>
                    {product.buy_now_price && product.buy_now_price > 0 && (
                        <button className="tab-btn inactive">
                            Kup teď ({product.buy_now_price?.toLocaleString('cs-CZ')} Kč)
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </button>
                    )}
                </div>
                {/* Zde chybí endpoint pro sledování */}
                <button className="follow-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Sledovat aukci
                </button>
            </div>

            {/* BOX S CENOU A ODPOČTEM */}
            <div className="bid-price-box">
                <div className="bid-price-header">
                    <span className="price-label">
                        {bidsData?.length ? "AKTUÁLNÍ CENA" : "STARTOVACÍ CENA"}
                    </span>
                    <div className="timer-badge">
                        {timeRemaining ? `Auction ${timeRemaining}` : "Loading..."}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                </div>
                <h2 className="price-value">{formattedCurrentPrice} Kč</h2>
                <div className="bids-count">
                    {bidsData?.length || 0} příhozů
                </div>
            </div>

            {/* SPODNÍ SEKCE PRO PŘÍHOZ */}
            <div className="bid-action-area">
                <div className="action-tabs">
                    <button className="action-tab-btn active">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                            <path d="m16 16 6-6"></path>
                            <path d="m8 8 6-6"></path>
                            <path d="m9 7 8 8"></path>
                            <path d="m21 11-8-8"></path>
                        </svg>
                        Přihodit teď
                    </button>
                </div>

                {error && <div className="error-message" style={{color: 'red', fontSize: '14px', marginBottom: '10px'}}>{error}</div>}

                <div className="bid-input-group">
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        min={minNextBid}
                        placeholder={`Minimálně ${minNextBid} Kč`}
                    />
                    <button
                        className="submit-bid-btn"
                        disabled={product.status !== Status.Pending || isLoading}
                        onClick={handleBidSubmit}
                    >
                        {isLoading ? "Odesílám..." : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                                    <path d="m16 16 6-6"></path>
                                    <path d="m8 8 6-6"></path>
                                    <path d="m9 7 8 8"></path>
                                    <path d="m21 11-8-8"></path>
                                </svg>
                                Přihodit
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}