import Navbar from "../../navbar/Navbar.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {type GroupResponse, groupService} from "../../../api/groupService.ts";
import LinkButton from "../../LinkButton.tsx";
import List from "../../List.tsx";
import UserPageMenu from "../UserPageMenu.tsx";
import AddMember from "./AddMember.tsx";
import ActionButton from "../../ActionButton.tsx";

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [showAddMember, setShowAddMember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        groupService.getGroupDetail(Number(groupId))
            .then((data) => {
                setGroup(data);
            })
            .catch(() => {
                setError("Nepodařilo se načíst skupinu.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId])

    return (
        <div className="page">
            <Navbar />

            <div className="user-page">
                <UserPageMenu currentWindow={"skupiny"} />

                {successMessage && <div className="alert-success">{successMessage}</div>}
                {error && <div className="alert-error">{error}</div>}

                {group &&
                    <div className="user-page-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="user-page-title">{group.name}</div>
                            <div style={ { display: "flex", justifyContent: "end", gap: "10px" }}>
                                <LinkButton
                                    title="Vytvořit aukci"
                                    link={`/vytvorit-aukci/${groupId}`}
                                    size="medium"
                                />
                                <ActionButton
                                    title="Přidat člena"
                                    size="medium"
                                    cursor="pointer"
                                    onClick={() => setShowAddMember(!showAddMember)}
                                />
                                {showAddMember &&
                                    <AddMember
                                        groupId={Number(groupId)}
                                        setSaving={setLoading}
                                        setSuccessMessage={setSuccessMessage}
                                        setError={setError}
                                    />
                                }
                            </div>
                        </div>

                        <div className="user-page-content-container">
                            {loading ? (
                                <div className="alert-info">Načítání skupin...</div>
                            ) : (
                                <div className="user-page-items">
                                    <span>Organizace: {group.organization}</span>
                                    <span>Manažer: {group.manager.first_name} {group.manager.last_name}</span>
                                    <span>Členové:</span>
                                    <List items={group.members}
                                          renderItem={(member) => (
                                              <>
                                                  <div className="item-col">{member.first_name} {member.last_name}</div>
                                              </>
                                          )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}