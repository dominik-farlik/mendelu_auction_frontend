import { useParams } from "react-router-dom";
import UserDetail from "./users/UserDetail.tsx";
import UserGroups from "./groups/UserGroups.tsx";
import BidFollowAuctions from "./bidOrFollow/BidFollowAuctions.tsx";
import Navbar from "../navbar/Navbar.tsx";
import CreateGroup from "./groups/CreateGroup.tsx";
import UserPageMenu from "./UserPageMenu.tsx";
import Page from "../Page.tsx";

export default function UserPage() {
    const { activeWindow } = useParams<{ activeWindow: string }>();
    const currentWindow = activeWindow || "osobni-udaje";

    return (
        <Page>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
                <UserPageMenu currentWindow={currentWindow} />

                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm border border-slate-200">
                    {currentWindow === "osobni-udaje" && <UserDetail />}
                    {currentWindow === "skupiny" && <UserGroups />}
                    {currentWindow === "vytvorit-skupinu" && <CreateGroup />}
                    {currentWindow === "moje-prihozy" && <BidFollowAuctions />}
                </div>
            </div>
        </Page>
    );
}