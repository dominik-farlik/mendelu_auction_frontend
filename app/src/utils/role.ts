import { userService } from "../api/userService.ts";
import { Role } from "../types/user.ts";

export async function fetchUserRole(): Promise<Role> {
    try {
        const data = await userService.getCurrentUser();
        return data.role.name as Role;
    } catch {
        console.log("Nepodařilo se načíst uživatelská data, vrací se výchozí Viewer.");
        return Role.Viewer;
    }
}