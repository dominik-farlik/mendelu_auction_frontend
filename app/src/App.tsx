import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomePage from "./components/home/HomePage.tsx";
import AuthForm from "./components/auth/AuthForm.tsx";
import { checkIfLoggedInLoader } from "./components/auth/AuthLoader.tsx";
import CreateAuction from "./components/auction/CreateAuction.tsx";
import UserPage from "./components/user/UserPage.tsx";
import GroupDetail from "./components/user/groups/GroupDetail.tsx";
import AuctionDetail from "./components/auction/AuctionDetail.tsx";
import {Toaster} from "react-hot-toast";

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
        path: "/vytvorit-aukci/:groupId",
        element: <CreateAuction />
    },
    {
        path: "/profil",
        element: <Navigate to="/profile/osobni-udaje" replace />
    },
    {
        path: "/profil/:activeWindow",
        element: <UserPage />
    },
    {
        path: "/skupina/:groupId",
        element: <GroupDetail />
    },
    {
        path: "/aukce/detail/:productId",
        element: <AuctionDetail />
    }
]);

function App() {
    return (
        <>
            <RouterProvider router={router}/>
            <Toaster position="top-center"/>
        </>
    )
}

export default App;