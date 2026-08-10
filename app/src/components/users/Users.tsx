import { useEffect, useState } from "react";
import UserPage from "../profile/UserPage.tsx";
import {type UserResponse, userService} from "../../api/userService.ts";
import toast from "react-hot-toast";
import UserList from "./UserList.tsx";


export default function Users() {
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const toastId = toast.loading("Načítání uživatelů...");

        userService.getAllUsers()
            .then((data) => {
                toast.dismiss(toastId);
                setUsers(data)
            })
            .catch(() => toast.error("Nepodařilo se načíst uživatelská data.", { id: toastId }))
    }, []);

    return (
        <UserPage currentWindow="sprava-uzivatelu">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Správa uživatelů</h2>
            <UserList users={users} />
        </UserPage>
    );
}