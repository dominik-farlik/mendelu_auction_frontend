import { useParams, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo.tsx";
import GroupInfo from "./GroupInfo.tsx";
import UserAuctions from "./UserAuctions.tsx";
import BidFollowAuctions from "./BidFollowAuctions.tsx";
import Navbar from "../navbar/Navbar.tsx";
import './UserPage.css';

export default function UserPage() {
    const { activeWindow } = useParams<{ activeWindow: string }>();
    const navigate = useNavigate();
    const currentWindow = activeWindow || "osobni-udaje";

    const handleTabChange = (windowName: string) => {
        navigate(`/profil/${windowName}`);
    };

    return (
        <>
            <Navbar />
            <div className="user-page">
                <div className="user-page-menu">
                    <button
                        className={currentWindow === "osobni-udaje" ? "active" : ""}
                        onClick={() => handleTabChange("osobni-udaje")}
                    >
                        UserInfo
                    </button>
                    <button
                        className={currentWindow === "skupiny" ? "active" : ""}
                        onClick={() => handleTabChange("skupiny")}
                    >
                        GroupInfo
                    </button>
                    <button
                        className={currentWindow === "moje-aukce" ? "active" : ""}
                        onClick={() => handleTabChange("moje-aukce")}
                    >
                        UserAuctions
                    </button>
                    <button
                        className={currentWindow === "moje-prihozy" ? "active" : ""}
                        onClick={() => handleTabChange("moje-prihozy")}
                    >
                        BidFollowAuctions
                    </button>
                </div>
                <div className="user-page-content">
                    {currentWindow === "osobni-udaje" && <UserInfo />}
                    {currentWindow === "skupiny" && <GroupInfo />}
                    {currentWindow === "moje-aukce" && <UserAuctions />}
                    {currentWindow === "moje-prihozy" && <BidFollowAuctions />}
                </div>
            </div>
        </>
    );
}