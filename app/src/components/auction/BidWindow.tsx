import { useState } from "react";
import { type ProductBids, type ProductResponse } from "../../api/productService.ts";
import { Status } from "../../types/product.ts";
import { userService } from "../../api/userService.ts";
import TimerBadge from "../TimerBadge.tsx";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function BidWindow({ product, bidsData }: { product: ProductResponse, bidsData: ProductBids[] }) {
    const [activeTab, setActiveTab] = useState<'auction' | 'buy_now'>('auction');
    const [isBidding, setIsBidding] = useState<boolean>(false);
    const [isBuying, setIsBuying] = useState<boolean>(false);

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
            toast.error(`Příhoz musí být alespoň ${minNextBid} Kč`);
            return;
        }

        setIsBidding(true);
        const bidPromise = userService.bid(product.id, Number(bidAmount))
            .finally(() => setIsBidding(false));

        toast.promise(bidPromise, {
            loading: "Zpracování příhozu...",
            success: "Příhoz byl úspěšně zaznamenán!",
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                return axiosError.response?.data?.detail || "Došlo k chybě při příhozu.";
            }
        });
    };

    const handleBuyNowSubmit = async () => {
        setIsBuying(true);
        const buyPromise = new Promise((resolve) => setTimeout(resolve, 1000))
            .finally(() => setIsBuying(false));

        toast.promise(buyPromise, {
            loading: "Přesměrování na platební bránu...",
            success: "Položka byla úspěšně zakoupena!",
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                return axiosError.response?.data?.detail || "Došlo k chybě při nákupu.";
            }
        });
    };

    const formattedCurrentPrice = currentPrice?.toLocaleString('cs-CZ');
    const formattedBuyNowPrice = product.buy_now_price?.toLocaleString('cs-CZ');

    // UPRAVENO PRO SVĚTLÝ DESIGN
    const isBuyNow = activeTab === 'buy_now';
    // Místo tmavé barvy používáme bílou (bg-white) s jemným stínem pro aukci
    const cardBg = isBuyNow ? 'bg-[#4ade80] text-slate-900' : 'bg-white text-slate-900 shadow-xl border border-gray-100';
    // Pozadí pro přepínač záložek (světle šedá pro aukci)
    const tabContainerBg = isBuyNow ? 'bg-black/10' : 'bg-gray-100';
    // Tlačítko sledovat aukci (šedý okraj pro aukci)
    const btnOutline = isBuyNow ? 'border-slate-900/20 text-slate-900 hover:bg-black/5' : 'border-gray-200 text-slate-700 hover:bg-gray-50';

    return (
        <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 transition-colors duration-300 ${cardBg}`}>
            {/* HORNÍ NAVIGACE A SLEDOVÁNÍ */}
            <div className="flex justify-between items-center mb-8">
                <div className={`flex p-1 rounded-full ${tabContainerBg}`}>
                    <button
                        className={`px-5 py-2 rounded-full text-sm font-bold flex items-center transition-colors ${
                            !isBuyNow
                                ? 'bg-white text-slate-900 shadow-sm' // Změněno na světlé aktivní tlačítko
                                : 'text-slate-700 hover:text-slate-900'
                        }`}
                        onClick={() => setActiveTab('auction')}
                    >
                        Aukce
                    </button>
                    {product.buy_now_price && product.buy_now_price > 0 && (
                        <button
                            className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${
                                isBuyNow
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-gray-500 hover:text-slate-900' // Tmavší text pro neaktivní stav
                            }`}
                            onClick={() => setActiveTab('buy_now')}
                        >
                            Kup teď
                            <span className={isBuyNow ? 'text-slate-500' : 'text-gray-400'}>
                                {formattedBuyNowPrice} Kč
                            </span>
                        </button>
                    )}
                </div>

                <button className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-colors ${btnOutline}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Sledovat aukci
                </button>
            </div>

            {/* OBSAH PODLE VYBRANÉ ZÁLOŽKY */}
            {!isBuyNow ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* ZÁLOŽKA AUKCE */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide"> {/* Tmavší šedá textu */}
                                {bidsData?.length ? "AKTUÁLNÍ CENA" : "STARTOVACÍ CENA"}
                            </span>
                            <TimerBadge endTime={product.ends_at}/>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight text-slate-900">{formattedCurrentPrice} Kč</h2>
                    </div>

                    <div>
                        <div className="flex gap-6 mb-4">
                            <button className="flex items-center gap-2 text-[#4ade80] font-bold text-lg border-b-2 border-[#4ade80] pb-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"></path>
                                    <path d="m16 16 6-6"></path>
                                    <path d="m8 8 6-6"></path>
                                    <path d="m9 7 8 8"></path>
                                    <path d="m21 11-8-8"></path>
                                </svg>
                                Přihodit teď
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                {/* Změněn vzhled inputu pro světlý design (bg-white, border-gray-300) */}
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                    min={minNextBid}
                                    placeholder={`Min. ${minNextBid}`}
                                    className="w-full bg-white border border-gray-300 text-slate-900 rounded-2xl px-5 py-4 text-lg font-bold outline-none focus:border-[#4ade80] focus:ring-4 focus:ring-[#4ade80]/10 transition-all pr-14 shadow-sm"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg pointer-events-none">
                                    Kč
                                </span>
                            </div>

                            <button
                                className="bg-[#4ade80] text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#3bcf71] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                                disabled={product.status !== Status.Pending || isBidding}
                                onClick={handleBidSubmit}
                            >
                                {isBidding ? "Odesílám..." : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            ) : (
                <div className="flex flex-col items-center py-6 animate-in fade-in zoom-in-95 duration-300">
                    {/* ZÁLOŽKA KUP TEĎ (Zůstala zachována) */}
                    <div className="mb-4">
                        <TimerBadge endTime={product.ends_at}/>
                    </div>

                    <h2 className="text-6xl font-bold tracking-tight mb-10">{formattedBuyNowPrice} Kč</h2>

                    <button
                        className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-xl flex items-center gap-3 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 transition-all"
                        disabled={product.status !== Status.Pending || isBuying}
                        onClick={handleBuyNowSubmit}
                    >
                        {isBuying ? "Zpracovávám..." : (
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v4l3 3"></path>
                                </svg>
                                Vydražit a zaplatit
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-2 mt-8 text-sm font-medium opacity-80">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Úhrada pouze platební bránou. Limit na úhradu 5 minut.</span>
                    </div>
                </div>
            )}
        </div>
    );
}