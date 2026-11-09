import { useState, useEffect } from "react";
import {type ProductResponse, productService} from "../../api/productService.ts";
import LinkButton from "../buttons/LinkButton.tsx";
import TimerBadge from "../TimerBadge.tsx";
import {AnimatePresence, motion} from "framer-motion";

const AUTOPLAY_MS = 7000;

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">{label}</p>
            <p className="text-xl md:text-2xl font-black text-white m-0 mt-1 truncate">{value}</p>
        </div>
    );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-10 h-10 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            aria-label={direction === "prev" ? "Předchozí aukce" : "Další aukce"}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
        </button>
    );
}

export default function MainAuctions() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getMainActiveAuctions()
            .then(setAuctions)
            .catch((error) => console.error("Chyba při načítání aukcí:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (auctions.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % auctions.length);
        }, AUTOPLAY_MS);

        return () => clearInterval(interval);
    }, [auctions.length, currentIndex]);

    const showNext = () => setCurrentIndex((prev) => (prev + 1) % auctions.length);
    const showPrev = () => setCurrentIndex((prev) => (prev === 0 ? auctions.length - 1 : prev - 1));

    if (!loading && auctions.length === 0) {
        return null;
    }

    const currentAuction = auctions[currentIndex];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8 relative z-10">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
                <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-[#4ade80] uppercase tracking-[0.2em]">
                        <span className="w-6 h-0.5 bg-[#4ade80] rounded-full"></span>
                        Vybrané nabídky
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight m-0">
                        Hlavní aukce
                    </h2>
                </div>

                {auctions.length > 1 && (
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="text-sm font-bold text-white/60 tabular-nums">
                            {currentIndex + 1} / {auctions.length}
                        </span>
                        <ArrowButton direction="prev" onClick={showPrev} />
                        <ArrowButton direction="next" onClick={showNext} />
                    </div>
                )}
            </div>

            {!currentAuction ? (
                <div className="animate-pulse h-120 md:h-105 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem]"></div>
            ) : (
                <div className="bg-[#121827]/80 backdrop-blur-md border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        <MainAuctionSlide
                            key={currentAuction.id}
                            auction={currentAuction}
                            onSwipeLeft={showNext}
                            onSwipeRight={showPrev}
                            draggable={auctions.length > 1}
                        />
                    </AnimatePresence>
                </div>
            )}

            {auctions.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    {auctions.map((auction, index) => (
                        <button
                            key={auction.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`rounded-full transition-all duration-300 cursor-pointer ${
                                currentIndex === index
                                    ? "w-6 h-2.5 bg-[#4ade80]"
                                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                            }`}
                            aria-label={`Přejít na aukci ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

type MainAuctionSlideProps = {
    auction: ProductResponse;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    draggable: boolean;
};

function MainAuctionSlide({ auction, onSwipeLeft, onSwipeRight, draggable }: MainAuctionSlideProps) {
    const hasBids = auction.bids && auction.bids.length > 0;
    const currentPrice = hasBids
        ? Math.max(...auction.bids.map((bid) => bid.amount || 0))
        : auction.starting_price;

    const finalPrice = currentPrice || auction.buy_now_price;
    const saleType = currentPrice ? (hasBids ? "Aktuální cena" : "Vyvolávací cena") : "Kup teď";

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 md:items-stretch"
            drag={draggable ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset }) => {
                const swipeThreshold = 50;
                if (offset.x < -swipeThreshold) onSwipeLeft();
                else if (offset.x > swipeThreshold) onSwipeRight();
            }}
        >
            {/* Obrázek: na mobilu nahoře, na desktopu vpravo. Pevný poměr stran, aby karta mezi aukcemi neposkakovala. */}
            <div className="md:order-2 p-3 md:p-5">
                <div className="relative aspect-4/3 md:aspect-auto md:h-full md:min-h-96 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-800">
                    {auction.cover_image ? (
                        <img
                            src={`${import.meta.env.VITE_IMAGES_URL}/${auction.cover_image}`}
                            alt={auction.title}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium">
                            Bez obrázku
                        </div>
                    )}
                    <span className="absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold">
                        {auction.category}
                    </span>
                </div>
            </div>

            <div className="md:order-1 flex flex-col gap-5 md:gap-6 px-5 pb-6 pt-2 md:p-10 lg:p-12 md:justify-center min-w-0">
                <div className="self-start px-3 py-1.5 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/10 text-[#4ade80] text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                    <TimerBadge startTime={auction.starts_at} endTime={auction.ends_at} style={false}/>
                </div>

                <div className="flex flex-col gap-3 min-w-0">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight uppercase tracking-wide m-0 line-clamp-2 break-words">
                        {auction.title}
                    </h3>
                    {auction.description && (
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed m-0 line-clamp-2 md:line-clamp-3">
                            {auction.description}
                        </p>
                    )}
                </div>

                <div className={`grid gap-3 ${hasBids ? "grid-cols-2" : "grid-cols-1 sm:max-w-60"}`}>
                    <Stat label={saleType} value={`${finalPrice?.toLocaleString("cs-CZ") ?? "–"} Kč`} />
                    {hasBids && <Stat label="Příhozů" value={String(auction.bids.length)} />}
                </div>

                <div>
                    <LinkButton link={`/aukce/detail/${auction.id}`} title="Zobrazit nabídku" size="large" />
                </div>
            </div>
        </motion.div>
    );
}
