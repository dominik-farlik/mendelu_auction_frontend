import MainAuctions from "./firstScreen/MainAuctions.tsx";
import ActiveAuctions from "./activeAuctions/ActiveAuctions.tsx";
import Hero from "../Hero.tsx";
import Page from "../Page.tsx";

export default function HomePage() {
    return (
        <Page>
            <Hero navbarTextColor="light">
                <MainAuctions />
            </Hero>
            <ActiveAuctions />
        </Page>
    )
}