import MainAuctions from "./MainAuctions.tsx";
import ActiveAuctions from "./ActiveAuctions.tsx";
import Hero from "../Hero.tsx";
import Page from "../Page.tsx";
import OrganizationsBand from "../OrganizationsBand.tsx";
import HomeBanner from "./HomeBanner.tsx";

export default function HomePage() {
    return (
        <Page>
            <Hero navbarTextColor="light">
                <HomeBanner/>
                <OrganizationsBand variant="band"/>
                <MainAuctions/>
            </Hero>
            <ActiveAuctions/>
        </Page>
    )
}
