import React, { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import UserInput from "../users/UserInput.tsx";
import {type GroupCreate, groupService} from "../../../api/groupService.ts";
import SubmitButton from "../../SubmitButton.tsx";

export default function CreateGroup() {
    const [group, setGroup] = useState<GroupCreate>({
        name: "",
        organization: "",
    });
    const [creating, setCreating] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGroup((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage(null);
        setError(null);
        setCreating(true);

        try {
            await groupService.createGroup({
                name: group.name,
                organization: group.organization || null,
            });

            navigate("/profil/skupiny");
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Chyba při vytváření skupiny.";
            const strError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            setError(strError);
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <div className="user-page-content-container">

                {error && <div className="alert-error">{error}</div>}
                {successMessage && <div className="alert-success">{successMessage}</div>}

                <div className="user-page-title">Vytvořit novou skupinu</div>
                <form onSubmit={handleSubmit} className="user-page-items">
                    <UserInput
                        label="Název skupiny*"
                        type="text"
                        name="name"
                        value={group.name}
                        handleChange={handleChange}
                        required={true}
                    />
                    <UserInput
                        label="Organizace"
                        type="text"
                        name="organization"
                        value={group.organization || undefined}
                        handleChange={handleChange}
                    />

                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <SubmitButton
                            title={creating ? "Vytvářím..." : "Vytvořit"}
                            size="medium"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}