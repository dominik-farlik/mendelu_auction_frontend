import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import api from "../../api/axios.ts";
import type {AxiosError} from "axios";

interface User {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export default function UserInfo() {
    const [user, setUser] = useState<User>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
    });

    const [initialUser, setInitialUser] = useState<User>({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const isDirty = JSON.stringify(user) !== JSON.stringify(initialUser);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        api.get("/users/me/")
            .then((r) => {
                setUser(r.data);
                setInitialUser(r.data);
            })
            .catch((err) => {
                console.error("Chyba při načítání uživatele:", err);
                setMessage({ text: "Nepodařilo se načíst uživatelská data.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setMessage(null);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user.email || !user.first_name || !user.last_name) {
            setMessage({ text: "Vyplňte prosím všechna povinná pole.", type: "error" });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const response = await api.put("/users/me/", user);
            setUser(response.data);
            setInitialUser(response.data);
            setMessage({ text: "Změny byly úspěšně uloženy.", type: "success" });
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Chyba při ukládání změn.";
            setMessage({ text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Načítání...</div>;
    }

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h2>Upravit profil</h2>

            {blocker.state === "blocked" && (
                <div style={{
                    background: "#fff3cd",
                    border: "1px solid #ffeeba",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "4px"
                }}>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
                        Máte neuložené změny. Opravdu chcete odejít?
                    </p>
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

            {message && (
                <div style={{ padding: "10px", marginBottom: "15px", color: message.type === 'success' ? 'green' : 'red' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                    <label>E-mail *</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={user.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Uživatelské jméno</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Jméno *</label>
                    <input
                        type="text"
                        name="first_name"
                        required
                        value={user.first_name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Příjmení *</label>
                    <input
                        type="text"
                        name="last_name"
                        required
                        value={user.last_name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving || !isDirty}
                    style={{ padding: "10px", cursor: isDirty && !saving ? "pointer" : "not-allowed" }}
                >
                    {saving ? "Ukládám..." : "Uložit změny"}
                </button>
            </form>
        </div>
    );
}