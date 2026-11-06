import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import UserPage from "../profile/UserPage.tsx";
import { type UserResponse, userService } from "../../api/userService.ts";
import { useAuth } from "../../context/useAuth.ts";
import { Role } from "../../types/user.ts";
import { formatPhone } from "../../utils/formatPhone.ts";

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
    { value: Role.Viewer, label: "Divák", description: "Může přihazovat a sledovat aukce." },
    { value: Role.Editor, label: "Editor", description: "Navíc vytváří aukce ve svých skupinách." },
    { value: Role.Manager, label: "Manažer", description: "Schvaluje aukce a spravuje skupiny, organizace i uživatele." },
];

const roleLabel = (role: Role) => ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

const ROLE_BADGE_CLASSES: Record<Role, string> = {
    [Role.Viewer]: "bg-slate-100 text-slate-600",
    [Role.Editor]: "bg-[#4ade80]/20 text-[#16a34a]",
    [Role.Manager]: "bg-slate-900 text-white",
};

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-slate-900 font-medium truncate">{children}</span>
        </div>
    );
}

export default function User() {
    const { user: currentUser } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingRole, setUpdatingRole] = useState<Role | null>(null);

    const isSelf = currentUser?.id === user?.id;

    useEffect(() => {
        userService.getUser(Number(userId))
            .then(setUser)
            .catch(() => {
                setUser(null);
                toast.error("Nepodařilo se načíst data o uživateli.");
            })
            .finally(() => setLoading(false));
    }, [userId]);

    const handleRoleChange = async (role: Role) => {
        if (!user || role === user.role.name || updatingRole) return;

        setUpdatingRole(role);
        try {
            const updatedUser = await userService.updateUserRole(user.id, role);
            setUser(updatedUser);
            toast.success(`Role byla změněna na „${roleLabel(role)}“.`);
        } catch (err) {
            const detail = (err as AxiosError<{ detail?: unknown }>).response?.data?.detail;
            toast.error(typeof detail === "string" ? detail : "Nepodařilo se změnit roli uživatele.");
        } finally {
            setUpdatingRole(null);
        }
    };

    return (
        <UserPage currentWindow="sprava-uzivatelu">
            <Link
                to="/profil/sprava-uzivatelu"
                className="self-start mb-6 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Zpět na správu uživatelů
            </Link>

            {loading && (
                <div className="flex justify-center items-center py-20 grow">
                    <svg className="animate-spin h-8 w-8 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            {!loading && !user && (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                    <span className="text-slate-500 font-medium">Uživatel nebyl nalezen.</span>
                </div>
            )}

            {!loading && user && (
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-[#4ade80]/20 text-[#16a34a] flex items-center justify-center font-black text-2xl md:text-3xl uppercase">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0 break-words">
                                {user.first_name} {user.last_name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ROLE_BADGE_CLASSES[user.role.name]}`}>
                                    {roleLabel(user.role.name)}
                                </span>
                                {user.username && <span className="text-slate-500 font-medium">@{user.username}</span>}
                                <Link
                                    to={`/profil-uzivatele/${user.id}`}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition-colors"
                                >
                                    Veřejný profil
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InfoItem label="E-mail">
                            <a href={`mailto:${user.email}`} className="hover:underline underline-offset-4" title={user.email}>
                                {user.email}
                            </a>
                        </InfoItem>
                        <InfoItem label="Telefon">
                            {user.phone_number
                                ? formatPhone(user.phone_number)
                                : <span className="text-slate-400 italic">nezadáno</span>}
                        </InfoItem>
                        <InfoItem label="Uživatelské jméno">
                            {user.username || <span className="text-slate-400 italic">nezadáno</span>}
                        </InfoItem>
                        <InfoItem label="Příjmení na veřejném profilu">
                            {user.public_last_name ? "Zobrazuje se celé" : "Jen iniciála"}
                        </InfoItem>
                    </div>

                    <div className="flex flex-col gap-4 pt-6 border-t border-slate-200">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight m-0">Role uživatele</h3>
                            {isSelf && (
                                <p className="text-sm text-slate-500 mt-1 mb-0">
                                    Vlastní roli změnit nemůžete, přišli byste o přístup ke správě.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {ROLE_OPTIONS.map((option) => {
                                const active = user.role.name === option.value;
                                const disabled = isSelf || updatingRole !== null;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleRoleChange(option.value)}
                                        disabled={disabled && !active}
                                        aria-pressed={active}
                                        className={`text-left rounded-2xl border p-4 flex flex-col gap-1 transition-all ${
                                            active
                                                ? "border-[#4ade80] bg-[#4ade80]/10 ring-4 ring-[#4ade80]/20"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-slate-200"
                                        }`}
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="font-bold text-slate-900">{option.label}</span>
                                            {active && (
                                                <svg className="w-5 h-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {updatingRole === option.value && (
                                                <span className="text-xs font-bold text-slate-400 animate-pulse">Ukládám...</span>
                                            )}
                                        </span>
                                        <span className="text-sm text-slate-500">{option.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </UserPage>
    );
}
