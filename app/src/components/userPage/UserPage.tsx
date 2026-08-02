import { useParams } from "react-router-dom";
import UserDetail from "./users/UserDetail.tsx";
import UserGroups from "./groups/UserGroups.tsx";
import BidFollowAuctions from "./BidFollowAuctions.tsx";
import Navbar from "../navbar/Navbar.tsx";
import './UserPage.css';
import CreateGroup from "./groups/CreateGroup.tsx";
import UserPageMenu from "./UserPageMenu.tsx";

export default function UserPage() {
    const { activeWindow } = useParams<{ activeWindow: string }>();
    const currentWindow = activeWindow || "osobni-udaje";


    return (
        <div className="page">
            <Navbar />
            <div className="user-page">
                <UserPageMenu currentWindow={currentWindow} />
                <div className="user-page-content">
                    {currentWindow === "osobni-udaje" && <UserDetail />}
                    {currentWindow === "skupiny" && <UserGroups />}
                    {currentWindow === "vytvorit-skupinu" && <CreateGroup />}
                    {currentWindow === "moje-prihozy" && <BidFollowAuctions />}
                </div>
            </div>
        </div>
    );
}