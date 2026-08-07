import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LinkButton from "../../buttons/LinkButton.tsx";
import GroupList from "./GroupList.tsx";
import { userService } from "../../../api/userService.ts";
import { Role } from "../../../types/user.ts";

export default function UserGroups() {
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání uživatelských dat...");

        userService.getCurrentUser()
            .then((data) => {
                setUserRole(data.role.name);
                toast.dismiss(toastId);
            })
            .catch((err) => {
                console.error("Chyba při načítání uživatele:", err);
                toast.error("Nepodařilo se načíst uživatelská data.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Moje skupiny
                </h2>
                {!loading && userRole === Role.Manager && (
                    <div className="flex">
                        <LinkButton
                            title="Vytvořit skupinu"
                            link="/profil/vytvorit-skupinu"
                            size="medium"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 grow">
                {!loading && <GroupList />}
            </div>
        </div>
    );
}