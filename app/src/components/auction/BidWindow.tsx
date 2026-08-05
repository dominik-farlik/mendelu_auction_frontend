import './BidWindow.css';
import {useState} from "react";
import {type ProductBids, type ProductResponse} from "../../api/productService.ts";
import { Status } from "../../types/product.ts";
import {userService} from "../../api/userService.ts";
import TimerBadge from "../TimerBadge.tsx";
import type {AxiosError} from "axios";

export default function BidWindow({ product, bidsData }: { product: ProductResponse, bidsData: ProductBids[] }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentPrice = bidsData && bidsData.length > 0
        ? Math.max(...bidsData.map(b => b.amount))
        : product.starting_price;

    const minNextBid = currentPrice + (product.min_bid || 0);

    const [bidAmount, setBidAmount] = useState<number | "">(minNextBid);
    const [prevMinNextBid, setPrevMinNextBid] = useState<number>(minNextBid);


    if (minNextBid !== prevMinNextBid) {
        setPrevMinNextBid(minNextBid);

        if (bidAmount === "" || bidAmount < minNextBid) {
            setBidAmount(minNextBid);
        }
    }

    const handleBidSubmit = async () => {
        if (!bidAmount || bidAmount < minNextBid) {
            setError(`Příhoz musí být alespoň ${minNextBid} Kč`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await userService.bid(product.id, Number(bidAmount));

            // TIP: Zde přidejte toast notifikaci o úspěchu
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            setError(error.response?.data?.detail || "Došlo k chybě při příhozu.");
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
                    <TimerBadge endTime={product.ends_at}/>
                </div>
                <h2 className="price-value">{formattedCurrentPrice} Kč</h2>
                <div className="bids-count">

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
                        placeholder={`Minimálně ${minNextBid}`}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <span style={{ position: "absolute", fontSize: "1.4rem", marginRight: "10px", marginBottom: "1px", pointerEvents: "none" }}>Kč</span>
                    </div>

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