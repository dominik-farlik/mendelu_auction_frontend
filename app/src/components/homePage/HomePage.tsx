import MainAuctions from "./firstScreen/MainAuctions.tsx";
import Navbar from "../navbar/Navbar.tsx";
import ActiveAuctions from "./activeAuctions/ActiveAuctions.tsx";

export default function HomePage() {
    return (
        <div className="page">
            <div className="hero">
                <Navbar />
                <MainAuctions />
            </div>
            <ActiveAuctions />
        </div>
    )
}