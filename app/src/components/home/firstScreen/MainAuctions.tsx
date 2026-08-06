import { useState, useEffect } from "react";
import { type ProductResponse, productService } from "../../../api/productService.ts";
import LinkButton from "../../buttons/LinkButton.tsx";

export default function MainAuctions() {
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        productService.getActiveAuctions()
            .then((data) => {
                const bigPreviews = data.filter((auction) => auction.big_preview);
                setAuctions(bigPreviews);
                console.log("Aukce:", bigPreviews);
            })
            .catch((error) => console.error("Chyba při načítání aukcí:", error));
    }, []);

    useEffect(() => {
        if (auctions.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % auctions.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [auctions.length]);

    if (auctions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-125">
                <div className="animate-pulse w-3/4 h-96 bg-white/5 rounded-3xl"></div>
            </div>
        );
    }

    const currentAuction = auctions[currentIndex];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 relative z-10">
            {/* Hlavní karta aukce */}
            <div className="bg-[#121827]/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">

                {/* Levá část - Texty a akce */}
                <div className="flex-1 flex flex-col items-start z-10">
                    {/* Odpočet - Badge */}
                    <div className="px-4 py-1.5 rounded-full border border-orange-500/50 text-orange-400 text-sm font-semibold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Končí za 19 d {/* Zde napojíš dynamický výpočet času */}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8 uppercase tracking-wide">
                        {currentAuction.title || "Název aukce"}
                    </h1>

                    <div className="flex items-center gap-12 mb-8">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-slate-700/50 p-1 rounded-full text-[10px]">▲</span> Příhozů
                            </p>
                            <p className="text-3xl font-bold text-white">{currentAuction.bids.length || 0}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-slate-700/50 p-1 rounded-full text-[10px]">◎</span> Vyvolávací cena
                            </p>
                            <p className="text-3xl font-bold text-white">
                                {formatPrice(currentAuction.bids && currentAuction.bids.length > 0
                                    ? Math.max(...currentAuction.bids.map(b => b.amount))
                                    : currentAuction.starting_price || 9000)}
                            </p>
                        </div>
                    </div>

                    <LinkButton link={`/aukce/detail/${currentAuction.id}`} title="Zobrazit nabídku" size="large" />
                </div>

                {/* Pravá část - Obrázek s grafickým prvkem */}
                <div className="flex-1 relative w-full h-100 flex items-center justify-center z-10 mt-8 md:mt-0">
                    {/* Zářící kruh na pozadí (inspirováno obrázkem) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 h-87.5 md:w-112.5 md:h-112.5 rounded-full border-[6px] border-green-400/80 shadow-[0_0_50px_rgba(74,222,128,0.2)] z-0 pointer-events-none"></div>

                    <img
                        src={currentAuction.cover_image ? `${import.meta.env.VITE_IMAGES_URL}/${currentAuction.cover_image}` : "/placeholder-image.jpg"}
                        alt={currentAuction.title}
                        className="w-full max-w-lg h-auto object-cover rounded-3xl z-10 relative shadow-2xl transform transition-transform hover:scale-[1.02] duration-500"
                    />
                </div>
            </div>

            {/* Navigace / Tečky (pokud je aukcí více) */}
            {auctions.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    {auctions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`rounded-full transition-all duration-300 ${
                                currentIndex === index
                                    ? "w-6 h-3 bg-green-400"
                                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                            }`}
                            aria-label={`Přejít na aukci ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}