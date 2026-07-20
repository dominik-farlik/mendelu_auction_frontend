import { useState, useRef } from "react"
import "./MainAuctions.css"
import coverImage from "../assets/mikina_cover.jpg"
import BidButton from "./BidButton.tsx";
import Tag from "./Tag.tsx";
import Pagination from "./Pagination.tsx";

const AUCTIONS = [
    {title: "Hlavní popis zobrazované nabídky 1", description: "Description", category: "category", startPrice: 100, bid_count: 21, highest_bid: 2300, organization: "organization", duration: 3, coverImage: "coverImage.png", otherImages: ["otherImage1.png", "otherImage2.png"]},
    {title: "Hlavní popis zobrazované nabídky 2", description: "Description", category: "category", startPrice: 100, bid_count: 21, highest_bid: 2300, organization: "organization", duration: 3, coverImage: "coverImage.png", otherImages: ["otherImage1.png", "otherImage2.png"]},
    {title: "Hlavní popis zobrazované nabídky 3", description: "Description", category: "category", startPrice: 100, bid_count: 21, highest_bid: 2300, organization: "organization", duration: 3, coverImage: "coverImage.png", otherImages: ["otherImage1.png", "otherImage2.png"]},
]

export default function MainAuctions() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Funkce pro plynulé přesunutí na vybranou kartu po kliknutí na kolečko
    const scrollToCard = (index: number) => {
        setActiveIndex(index);

        if (scrollContainerRef.current && scrollContainerRef.current.children[index]) {
            scrollContainerRef.current.children[index].scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    };

    // Funkce, která aktualizuje aktivní kolečko, když uživatel scroluje ručně (např. prstem)
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const containerWidth = scrollContainerRef.current.clientWidth;

        // Výpočet indexu na základě toho, jak daleko je kontejner odscrolovaný
        const newIndex = Math.round(scrollPosition / containerWidth);

        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <div className="main-auctions">
            <div
                className="main-auctions-container"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                { AUCTIONS.map((auction, index) => (
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
                ))}
            </div>
            <Pagination
                totalItems={AUCTIONS.length}
                activeIndex={activeIndex}
                onDotClick={scrollToCard}
            />
        </div>
    )
}