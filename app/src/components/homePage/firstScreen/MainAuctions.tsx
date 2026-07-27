import { useState, useRef } from "react"
import "./MainAuctions.css"
import coverImage from "../../../assets/mikina_cover.jpg"
import Pagination from "../../Pagination.tsx";
import BigPreview from "./BigPreview.tsx";

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
                    <BigPreview
                        key={index}
                        auction={auction}
                        index={index}
                        coverImage={coverImage}
                    />
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