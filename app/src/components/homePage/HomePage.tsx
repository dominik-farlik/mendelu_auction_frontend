import MainAuctions from "./firstScreen/MainAuctions.tsx";
import ActiveAuctions from "./activeAuctions/ActiveAuctions.tsx";
import Hero from "../Hero.tsx";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Hero navbarTextColor="light">
                <MainAuctions />
            </Hero>
            <ActiveAuctions />
        </div>
    )
}