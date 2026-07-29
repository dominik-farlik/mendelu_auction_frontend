import { useState } from "react";
import { AxiosError } from "axios";
import api from "../../../api/axios.ts";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setCreating(true);

        try {
            await api.post("/groups/", {
                name: groupName,
                organization_id: null,
            });

            // Po úspěšném vytvoření přesměrujeme zpět na seznam skupin
            navigate("/skupiny");
        } catch (err) {
            const axiosErr = err as AxiosError<{ detail?: any }>;
            const detail = axiosErr.response?.data?.detail;

            let errorMessage = "Chyba při vytváření skupiny.";

            if (typeof detail === "string") {
                errorMessage = detail;
            } else if (Array.isArray(detail)) {
                errorMessage = detail.map((e) => e.msg).join(", ");
            } else if (typeof detail === "object" && detail !== null) {
                errorMessage = JSON.stringify(detail);
            }

            setFormError(errorMessage);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Vytvořit novou skupinu</h2>
            <form onSubmit={handleCreateGroup} style={{ background: "#f8f9fa", padding: "20px", marginTop: "15px", borderRadius: "6px" }}>
                {formError && <div style={{ color: "red", marginBottom: "10px" }}>{formError}</div>}

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Název skupiny *</label>
                    <input
                        type="text"
                        required
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                        placeholder="Zadejte název..."
                    />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        disabled={creating}
                        style={{ padding: "8px 15px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        {creating ? "Vytvářím..." : "Uložit skupinu"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/skupiny")}
                        style={{ padding: "8px 15px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        Zrušit
                    </button>
                </div>
            </form>
        </div>
    );
}