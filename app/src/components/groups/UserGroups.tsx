import LinkButton from "../buttons/LinkButton.tsx";
import GroupList from "./GroupList.tsx";
import { Role } from "../../types/user.ts";
import UserPage from "../user/UserPage.tsx";
import {useAuth} from "../../context/useAuth.ts";

export default function UserGroups() {
    const { user } = useAuth()

    return (
        <UserPage currentWindow="skupiny">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Moje skupiny
                    </h2>
                    {user?.role.name === Role.Manager && (
                        <div className="flex">
                            <LinkButton
                                title="Vytvořit skupinu"
                                link="/vytvorit-skupinu"
                                size="medium"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 grow">
                    <GroupList />
                </div>
        </UserPage>
    );
}