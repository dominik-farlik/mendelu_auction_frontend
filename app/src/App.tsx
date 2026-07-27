import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomePage from "./components/homePage/HomePage.tsx";
import AuthForm from "./components/auth/AuthForm.tsx";
import { checkIfLoggedInLoader } from "./components/auth/AuthLoader.tsx";
import CreateAuction from "./components/createAuction/CreateAuction.tsx";
import UserPage from "./components/userPage/UserPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <AuthForm defaultIsLogin={true} />,
        loader: checkIfLoggedInLoader,
    },
    {
        path: "/register",
        element: <AuthForm defaultIsLogin={false} />,
        loader: checkIfLoggedInLoader,
    },
    {
        path: "/vytvorit-aukci",
        element: <CreateAuction />
    },
    {
        path: "/profil",
        element: <Navigate to="/profile/osobni-udaje" replace />
    },
    {
        path: "/profil/:activeWindow",
        element: <UserPage />
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;