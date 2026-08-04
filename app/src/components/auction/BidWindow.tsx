import './BidWindow.css';

export default function BidWindow() {
    return (
        <div className="bid-window-card">
            {/* HORNÍ NAVIGACE A SLEDOVÁNÍ */}
            <div className="bid-window-header">
                <div className="bid-tabs">
                    <button className="tab-btn active">Auction</button>
                    <button className="tab-btn inactive">
                        Buy Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </button>
                </div>
                <button className="follow-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Currently followed
                </button>
            </div>

            {/* BOX S CENOU A ODPOČTEM */}
            <div className="bid-price-box">
                <div className="bid-price-header">
                    <span className="price-label">STARTING PRICE</span>
                    <div className="timer-badge">
                        Auction ends in 4 h 25 m
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                </div>
                <h2 className="price-value">500 Kč</h2>
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
                        Bid now
                    </button>
                    <button className="action-tab-btn inactive">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m4.9 4.9 14.2 14.2"></path>
                        </svg>
                        Maximum bid
                    </button>
                </div>

                <div className="bid-input-group">
                    {/* Záměrně statická hodnota a zarovnání doprava jako na obrázku */}
                    <input type="text" defaultValue="525 Kč" />
                    <button className="submit-bid-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                            <path d="m16 16 6-6"></path>
                            <path d="m8 8 6-6"></path>
                            <path d="m9 7 8 8"></path>
                            <path d="m21 11-8-8"></path>
                        </svg>
                        Bid
                    </button>
                </div>
            </div>
        </div>
    )
}