import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {type UserResponse, userService} from "../../api/userService.ts";
import toast from "react-hot-toast";
import Page from "../Page.tsx";
import Hero from "../Hero.tsx";
import {useAuth} from "../../context/useAuth.ts";
import {Role} from "../../types/user.ts";

export default function User() {
    const { user: currentUser } = useAuth();
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        userService.getUser(Number(userId))
            .then(data => setUser(data))
            .catch(() => toast.error("Nepodařilo se načíst data o uživateli."))
    }, [userId])

    return (
        <Page>
            <Hero navbarTextColor="dark">
                {user && (
                    <div>
                        {user.username ? (<div>{user.username}</div>
                        ) : (<div>{user.first_name} {user?.public_last_name && user.last_name}</div>)}

                        {currentUser && currentUser.role.name === Role.Manager && (
                            <div>{user?.role.name}</div>
                        ) }
                    </div>
                )}
            </Hero>
        </Page>
    )
}