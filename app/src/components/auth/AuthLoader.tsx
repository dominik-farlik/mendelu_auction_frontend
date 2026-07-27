import { redirect } from "react-router-dom";
import api from "../../api/axios.ts";

export async function checkIfLoggedInLoader() {
    try {
        const response = await api.get('/auth/me');
        console.log(response.data);
        return redirect('/');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}