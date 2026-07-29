import { useEffect, useState } from "react";
import CreateButton from "../../CreateButton.tsx";
import GroupList from "./GroupList.tsx";
import {userService} from "../../../api/userService.ts";
import {Role} from "../../../types/role.ts";

export default function GroupInfo() {
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userService.getCurrentUser()
            .then((data) => {
                setUserRole(data.role.name);
            })
            .catch((err) => {
                console.error("Chyba při načítání uživatele:", err);
                setError("Nepodařilo se načíst uživatelská data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Načítání skupin...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    const isManager = userRole === Role.Manager;

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="user-page-title">Moje skupiny</span>
                {isManager && (
                    <div style={ { display: "flex", justifyContent: "end" }}>
                        <CreateButton
                            title="Vytvořit skupinu"
                            link="/profil/vytvorit-skupinu"
                            size="medium"
                        />
                    </div>
                )}
            </div>
            <div className="user-page-content-container">
                <div className="user-page-items">
                    <GroupList setError={setError} setLoading={setLoading}/>
                </div>
            </div>
        </>
    );
}