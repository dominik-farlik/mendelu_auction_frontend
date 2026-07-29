import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "../../../api/axios.ts";
import CreateButton from "../../CreateButton.tsx";
import GroupList from "./GroupList.tsx";

interface User {
    id: number;
    email: string;
    username: string;
    role?: {
        name: string;
    };
}

export default function GroupInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get<User>("/users/me/");
                setUser(userRes.data);

            } catch (err) {
                const axiosErr = err as AxiosError<{ detail?: string }>;
                setError(axiosErr.response?.data?.detail || "Nepodařilo se načíst data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Načítání skupin...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    const isManager = user?.role?.name === "manager" || user?.role?.name === "admin";

    return (
        <div className="user-page-content-container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="user-page-title">Moje skupiny</span>
                {isManager && (
                    <div style={ { display: "flex", justifyContent: "end" }}>
                        <CreateButton
                            title="Vytvořit skupinu"
                            link="/profil/vytvorit-skupinu"
                            size="medium"
                        />
                    </div>
                )}
            </div>
            <div className="user-page-items">
                <GroupList setError={setError} setLoading={setLoading}/>
            </div>
        </div>
    );
}