import {useCallback, useEffect, useState} from "react";
import LinkButton from "../../buttons/LinkButton.tsx";
import GroupList from "./GroupList.tsx";
import {userService} from "../../../api/userService.ts";
import {Role} from "../../../types/user.ts";

export default function UserGroups() {
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

    const handleSetError = useCallback((err: string | null) => {
        setError(err);
    }, []);

    const handleSetLoading = useCallback((load: boolean) => {
        setLoading(load);
    }, []);

    return (
        <>
            <div className="user-page-title-container">
                <div className="user-page-title">Moje skupiny</div>
                {userRole === Role.Manager && (
                    <div style={ { display: "flex", justifyContent: "end" }}>
                        <LinkButton
                            title="Vytvořit skupinu"
                            link="/profil/vytvorit-skupinu"
                            size="medium"
                        />
                    </div>
                )}
            </div>
            <div className="user-page-content-container">
                {loading ? (
                    <div className="alert-info">Načítání skupin...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div className="user-page-items">
                        <GroupList setError={handleSetError} setLoading={handleSetLoading} />
                    </div>
                )}
            </div>
        </>
    );
}