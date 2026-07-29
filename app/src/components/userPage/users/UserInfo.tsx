import React, { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import type { AxiosError } from "axios";
import "./UserInfo.css";
import SubmitButton from "../../SubmitButton.tsx";
import UserInput from "./UserInput.tsx";
import { userService, type UserUpdate } from "../../../api/userService.ts";

export default function UserInfo() {
    const [user, setUser] = useState<UserUpdate & { username: string }>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
    });

    const [initialUser, setInitialUser] = useState<UserUpdate & { username: string }>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


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
                };
                setUser(formData);
                setInitialUser(formData);
            })
            .catch((err) => {
                console.error("Chyba při načítání uživatele:", err);
                setError("Nepodařilo se načíst uživatelská data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user.email || !user.first_name || !user.last_name) {
            setError("Vyplňte prosím všechna povinná pole.");
            return;
        }

        setSaving(true);

        try {
            const payload: UserUpdate = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username || null,
            };

            const updatedData = await userService.updateCurrentUser(payload);

            const formData = {
                email: updatedData.email,
                username: updatedData.username || "",
                first_name: updatedData.first_name || "",
                last_name: updatedData.last_name || "",
            };

            setUser(formData);
            setInitialUser(formData);
            setSuccessMessage("Změny byly úspěšně uloženy.");
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Chyba při ukládání změn.";
            const strError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            setError(strError);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Načítání...</div>;
    }

    return (
        <>
            <span className="user-page-title">Upravit profil</span>
            <div className="user-page-content-container">
                {blocker.state === "blocked" && (
                    <div>
                        <span>Máte neuložené změny. Opravdu chcete odejít?</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => blocker.proceed()}
                                style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "3px" }}
                            >
                                Odejít bez uložení
                            </button>
                            <button
                                onClick={() => blocker.reset()}
                                style={{ background: "#6c757d", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "3px" }}
                            >
                                Zůstat
                            </button>
                        </div>
                    </div>
                )}

                {error && <div className="alert-error">{error}</div>}
                {successMessage && <div className="alert-success">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="user-page-items">
                    <UserInput
                        label="Uživatelské jméno"
                        type="text"
                        name="username"
                        value={user.username}
                        handleChange={handleChange}
                    />
                    <UserInput
                        label="E-mail*"
                        type="email"
                        name="email"
                        value={user.email}
                        handleChange={handleChange}
                        required={true}
                    />
                    <UserInput
                        label="Jméno*"
                        type="text"
                        name="first_name"
                        value={user.first_name}
                        handleChange={handleChange}
                        required={true}
                    />
                    <UserInput
                        label="Příjmení*"
                        type="text"
                        name="last_name"
                        value={user.last_name}
                        handleChange={handleChange}
                        required={true}
                    />

                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <SubmitButton
                            title={saving ? "Ukládám..." : "Uložit změny"}
                            size="medium"
                            disabled={saving || !isDirty}
                            cursor={isDirty && !saving ? "pointer" : "not-allowed"}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}