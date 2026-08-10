import React, { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import SubmitButton from "../buttons/SubmitButton.tsx";
import { userService, type UserUpdate } from "../../api/userService.ts";
import UserPage from "./UserPage.tsx";

export default function UserDetail() {
    const [user, setUser] = useState<UserUpdate>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        public_last_name: false,
    });

    const [initialUser, setInitialUser] = useState<UserUpdate>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        public_last_name: false,
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    const isDirty = JSON.stringify(user) !== JSON.stringify(initialUser);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        userService.getCurrentUser()
            .then((data) => {
                const formData = {
                    email: data.email,
                    username: data.username || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    public_last_name: data.public_last_name || false,
                };
                setUser(formData);
                setInitialUser(formData);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst uživatelská data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user.email || !user.first_name || !user.last_name) {
            toast.error("Vyplňte prosím všechna povinná pole.");
            return;
        }

        setSaving(true);

        const payload: UserUpdate = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username || null,
            public_last_name: user.public_last_name,
        };

        const updatePromise = userService.updateCurrentUser(payload)
            .then((updatedData) => {
                const formData = {
                    email: updatedData.email,
                    username: updatedData.username || "",
                    first_name: updatedData.first_name || "",
                    last_name: updatedData.last_name || "",
                    public_last_name: updatedData.public_last_name || false,
                };
                setUser(formData);
                setInitialUser(formData);
                return "Změny byly úspěšně uloženy.";
            });

        await toast.promise(updatePromise, {
            loading: "Ukládám změny...",
            success: (msg) => msg,
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                return axiosError.response?.data?.detail || "Chyba při ukládání změn.";
            }
        }).finally(() => {
            setSaving(false);
        });
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] focus:bg-white transition-all shadow-sm";
    const labelClasses = "text-sm font-bold text-slate-600 pl-1";

    return (
        <UserPage currentWindow="osobni-udaje">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Upravit profil</h2>

                <div className="flex flex-col gap-6 grow">
                    {blocker.state === "blocked" && (
                        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                            <span className="text-amber-800 font-bold">Máte neuložené změny. Opravdu chcete odejít?</span>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => blocker.proceed()}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-full text-sm font-bold transition-colors"
                                >
                                    Odejít
                                </button>
                                <button
                                    onClick={() => blocker.reset()}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-full text-sm font-bold transition-colors"
                                >
                                    Zůstat
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-20 grow">
                            <svg className="animate-spin h-8 w-8 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 grow">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Jméno */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="first_name" className={labelClasses}>
                                        Jméno*
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        value={user.first_name}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Příjmení a Checkbox */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="last_name" className={labelClasses}>
                                        Příjmení*
                                    </label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        value={user.last_name}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />

                                    {/* Nový Checkbox pro veřejné zobrazení příjmení */}
                                    <div className="flex items-center gap-2 mt-1 pl-1">
                                        <input
                                            type="checkbox"
                                            id="public_last_name"
                                            name="public_last_name"
                                            checked={user.public_last_name}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-[#4ade80] bg-slate-50 border-slate-300 rounded focus:ring-[#4ade80]/20 focus:ring-2 cursor-pointer accent-[#4ade80]"
                                        />
                                        <label
                                            htmlFor="show_last_name_publicly"
                                            className="text-sm font-medium text-slate-500 cursor-pointer select-none"
                                        >
                                            Veřejně zobrazovat příjmení
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Uživatelské jméno */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="username" className={labelClasses}>
                                        Uživatelské jméno
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={user.username || ""}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                </div>

                                {/* E-mail */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="email" className={labelClasses}>
                                        E-mail*
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            {/* Patička */}
                            <div className="flex justify-end pt-6 mt-auto border-t border-slate-100">
                                <SubmitButton
                                    title={saving ? "Ukládám..." : "Uložit změny"}
                                    size="medium"
                                    disabled={saving || !isDirty}
                                />
                            </div>
                        </form>
                    )}
                </div>
        </UserPage>
    );
}