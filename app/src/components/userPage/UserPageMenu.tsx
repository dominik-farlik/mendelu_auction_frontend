import MenuButton from "./MenuButton.tsx";
import {Role} from "../../types/user.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchUserRole} from "../../utils/role.ts";

export default function UserPageMenu({ currentWindow }: { currentWindow: string }) {
    const [userRole, setUserRole] = useState<Role>(Role.Viewer);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRole().then((role) => setUserRole(role));
    }, []);

    const handleTabChange = (windowName: string) => {
        navigate(`/profil/${windowName}`);
    };

    return (
        <div className="user-page-menu">
            <MenuButton
                title="Osobní údaje"
                windowName="osobni-udaje"
                active={currentWindow === "osobni-udaje"}
                handleTabChange={handleTabChange}
            />
            {(userRole === Role.Editor || userRole === Role.Manager) &&
                <MenuButton
                    title="Moje skupiny"
                    windowName="skupiny"
                    active={currentWindow === "skupiny" || currentWindow === "vytvorit-skupinu"}
                    handleTabChange={handleTabChange}
                />
            }
            <MenuButton
                title="Přihazuji a sleduji"
                windowName="moje-prihozy"
                active={currentWindow === "moje-prihozy"}
                handleTabChange={handleTabChange}
            />
        </div>
    )
}