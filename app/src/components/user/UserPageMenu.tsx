import MenuButton from "./MenuButton.tsx";
import { Role } from "../../types/user.ts";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";

export default function UserPageMenu({ currentWindow }: { currentWindow: string }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleTabChange = (windowName: string) => {
        navigate(`/profil/${windowName}`);
    };

    return (
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-2">
            <MenuButton
                title="Osobní údaje"
                windowName="osobni-udaje"
                active={currentWindow === "osobni-udaje"}
                handleTabChange={handleTabChange}
            />
            {(user?.role.name === Role.Editor || user?.role.name === Role.Manager) &&
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