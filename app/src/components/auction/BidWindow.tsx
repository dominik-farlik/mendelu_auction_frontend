import './BidWindow.css';
import { useEffect, useState } from "react";
import type { ProductResponse } from "../../api/productService.ts";
import {Status} from "../../types/product.ts";

// Předpoklad existence těchto enumů podle tvého kódu
// import { SaleType, Status } from "../../api/productService.ts";

export default function BidWindow({ product }: {product: ProductResponse}) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");

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
        const interval = setInterval(calculateTimeLeft, 60000); // Aktualizace každou minutu

        return () => clearInterval(interval);
    }, [product.ends_at]);

    // Formátování ceny pro hezčí zobrazení (např. 1 000 Kč)
    const formattedStartingPrice = product.starting_price?.toLocaleString('cs-CZ');

    return (
        <div className="bid-window-card">
            {/* HORNÍ NAVIGACE A SLEDOVÁNÍ */}
            <div className="bid-window-header">
                <div className="bid-tabs">
                    {/* Tlačítka lze později přepínat na základě product.sale_type */}
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
                <button className="follow-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    {/* Zde přijde logika, zda uživatel předmět sleduje */}
                    Sledovat aukci
                </button>
            </div>

            {/* BOX S CENOU A ODPOČTEM */}
            <div className="bid-price-box">
                <div className="bid-price-header">
                    {/* Zde se později hodí rozlišovat STARTING PRICE vs CURRENT BID */}
                    <span className="price-label">STARTOVACÍ CENA</span>
                    <div className="timer-badge">
                        {timeRemaining ? `Auction ${timeRemaining}` : "Loading..."}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                </div>
                <h2 className="price-value">{formattedStartingPrice} Kč</h2>
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

                <div className="bid-input-group">
                    {/* Typ změněn na number pro bezpečnější input, hodnota napojena na starting_price jako placeholder */}
                    <input
                        type="number"
                        defaultValue={product.starting_price}
                        min={product.starting_price}
                    />
                    <button className="submit-bid-btn" disabled={product.status !== Status.Pending}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                            <path d="m16 16 6-6"></path>
                            <path d="m8 8 6-6"></path>
                            <path d="m9 7 8 8"></path>
                            <path d="m21 11-8-8"></path>
                        </svg>
                        Přihodit
                    </button>
                </div>
            </div>
        </div>
    )
}