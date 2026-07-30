import { useParams, useNavigate } from "react-router-dom";
import UserInfo from "./users/UserInfo.tsx";
import GroupInfo from "./groups/GroupInfo.tsx";
import UserAuctions from "./UserAuctions.tsx";
import BidFollowAuctions from "./BidFollowAuctions.tsx";
import Navbar from "../navbar/Navbar.tsx";
import MenuButton from "./MenuButton.tsx";
import './UserPage.css';
import CreateGroup from "./groups/CreateGroup.tsx";

export default function UserPage() {
    const { activeWindow } = useParams<{ activeWindow: string }>();
    const navigate = useNavigate();
    const currentWindow = activeWindow || "osobni-udaje";

    const handleTabChange = (windowName: string) => {
        navigate(`/profil/${windowName}`);
    };

    return (
        <div className="page">
            <Navbar />
            <div className="user-page">
                <div className="user-page-menu">
                    <MenuButton
                        title="Osobní údaje"
                        windowName="osobni-udaje"
                        active={currentWindow === "osobni-udaje"}
                        handleTabChange={handleTabChange}
                    />
                    <MenuButton
                        title="Moje skupiny"
                        windowName="skupiny"
                        active={currentWindow === "skupiny" || currentWindow === "vytvorit-skupinu"}
                        handleTabChange={handleTabChange}
                    />
                    <MenuButton
                        title="Vytvořené aukce"
                        windowName="moje-aukce"
                        active={currentWindow === "moje-aukce"}
                        handleTabChange={handleTabChange}
                    />
                    <MenuButton
                        title="Přihazuji a sleduji"
                        windowName="moje-prihozy"
                        active={currentWindow === "moje-prihozy"}
                        handleTabChange={handleTabChange}
                    />
                </div>
                <div className="user-page-content">
                    {currentWindow === "osobni-udaje" && <UserInfo />}
                    {currentWindow === "skupiny" && <GroupInfo />}
                    {currentWindow === "vytvorit-skupinu" && <CreateGroup />}
                    {currentWindow === "moje-aukce" && <UserAuctions />}
                    {currentWindow === "moje-prihozy" && <BidFollowAuctions />}
                </div>
            </div>
        </div>
    );
}