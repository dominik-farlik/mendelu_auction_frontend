import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../../api/axios.ts";
import {AxiosError} from "axios";


interface Group {
    id: number;
    name: string;
    organization_id: number | null;
    manager_id: number | null;
    created_at: string;
}

type GroupListProps = {
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
};

export default function GroupList({ setError, setLoading }: GroupListProps) {
    const [groups, setGroups] = useState<Group[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupsRes = await api.get<Group[]>("/groups/my");
                setGroups(groupsRes.data);
            } catch (err) {
                const axiosErr = err as AxiosError<{ detail?: string }>;
                setError(axiosErr.response?.data?.detail || "Nepodařilo se načíst data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {groups.length === 0 ? (
                    <p style={{ marginTop: "20px", color: "#6c757d" }}>Nejste členem žádné skupiny.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
                        {groups.map((group) => (
                            <li key={group.id} className="list-item">
                                <span>{group.name}</span>
                                <button
                                    onClick={() => navigate(`/skupiny/${group.id}`)}
                                    style={{ padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
                                >
                                    Detail
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            }
        </>
    )
}