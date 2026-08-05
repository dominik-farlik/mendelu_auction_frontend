import FormInput from "../../FormInput.tsx";
import SubmitButton from "../../buttons/SubmitButton.tsx";
import React from "react";
import type {AxiosError} from "axios";
import {groupService} from "../../../api/groupService.ts";

type AddMemberProps = {
    groupId: number;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
    setSaving: (saving: boolean) => void;
}

export default function AddMember({groupId, setError, setSuccessMessage, setSaving}: AddMemberProps) {
    const [email, setEmail] = React.useState<string>("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        setSaving(true);

        try {
            await groupService.addGroupMember(groupId, {email: email});
            setEmail("");
            setSuccessMessage("Nový člen byl úspěšně přidán.");
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Chyba při přídávání člena skupiny.";
            const strError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            setError(strError);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                position: "absolute",
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "64px",
                minWidth: "30vw",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 1px",
                zIndex: 1000,
        }}
        >
            <FormInput
                label="E-mail"
                type="email"
                name="email"
                required={true}
                handleChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                    setSuccessMessage(null);
                }}
            />
            <div style={{ display: "flex", justifyContent: "end", marginTop: "15px" }}>
                <SubmitButton title="Přidat" size="medium" />
            </div>
        </form>
    )
}