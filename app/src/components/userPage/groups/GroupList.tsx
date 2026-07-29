import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";

type GroupListProps = {
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
};

export default function GroupList({ setError, setLoading }: GroupListProps) {
    const [groups, setGroups] = useState<Array<GroupResponse>>([]);

    const navigate = useNavigate();

    useEffect(() => {
        groupService.getCurrentUserGroups()
            .then((data) => {
                setGroups(data);
            })
            .catch((err) => {
                console.error("Chyba při načítání skupin:", err);
                setError("Nepodařilo se načíst vaše skupiny.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setError, setLoading]);

    return (
        <>
            {groups.length === 0 ? (
                <p style={{ marginTop: "20px", color: "#6c757d" }}>Zatím nejste členem žádné skupiny.</p>
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
            )}
        </>
    );
}