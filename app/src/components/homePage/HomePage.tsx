import MainAuctions from "./firstScreen/MainAuctions.tsx";
import Navbar from "../Navbar.tsx";
import ActiveAuctions from "./activeAuctions/ActiveAuctions.tsx";

export default function HomePage() {
    return (
        <>
            <div className="hero">
                <Navbar />
                <MainAuctions />
            </div>
            <ActiveAuctions />
        </>
    )
}