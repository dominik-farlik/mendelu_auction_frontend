import MainAuctions from "./MainAuctions.tsx";
import Navbar from "./Navbar.tsx";
import ActiveAuctions from "./ActiveAuctions.tsx";

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