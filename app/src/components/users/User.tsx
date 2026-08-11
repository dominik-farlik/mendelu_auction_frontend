import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type UserResponse, userService } from "../../api/userService.ts";
import toast from "react-hot-toast";
import Page from "../Page.tsx";
import { useAuth } from "../../context/useAuth.ts";
import { Role } from "../../types/user.ts";
import Navbar from "../navbar/Navbar.tsx";

export default function User() {
    const { user: currentUser } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        userService.getUser(Number(userId))
            .then(data => setUser(data))
            .catch(() => toast.error("Nepodařilo se načíst data o uživateli."));
    }, [userId]);

    async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (!userId) return;

        const newRole = e.target.value as Role;
        setIsUpdating(true);

        try {
            // Předáme userId a novou roli do API
            const updatedUser = await userService.updateUserRole(Number(userId), newRole);
            // Uložíme aktualizovaného uživatele (aby se změna hned projevila v UI)
            setUser(updatedUser);
            toast.success("Role uživatele byla změněna.");
        } catch {
            // Opraveno: zavolání toast.error místo pouhého stringu
            toast.error("Nepodařilo se změnit roli uživatele.");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <Page>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {user ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h1 className="text-xl font-bold text-gray-900">
                                {user.username ? (
                                    user.username
                                ) : (
                                    `${user.first_name} ${user.public_last_name ? user.last_name : ""}`
                                )}
                            </h1>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wide">
                                {user.role.name}
                            </span>
                        </div>

                        <div className="p-6">
                            {currentUser && currentUser.role.name === Role.Manager && (
                                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
                                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                                        Administrativní akce
                                    </h2>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label
                                            htmlFor="roleSelect"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Změnit roli uživatele:
                                        </label>
                                        <select
                                            id="roleSelect"
                                            value={user.role.name}
                                            onChange={handleRoleChange}
                                            disabled={isUpdating}
                                            className="block w-full sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <option value={Role.Viewer}>{Role.Viewer}</option>
                                            <option value={Role.Editor}>{Role.Editor}</option>
                                            <option value={Role.Manager}>{Role.Manager}</option>
                                        </select>

                                        {isUpdating && (
                                            <span className="text-sm text-gray-500 animate-pulse">
                                                Ukládám...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    ) : (
                    <div className="flex justify-center items-center h-48">
                    <div className="text-gray-500 font-medium">Načítání profilu...</div>
                    </div>
                    )}
            </div>
        </Page>
    );
}