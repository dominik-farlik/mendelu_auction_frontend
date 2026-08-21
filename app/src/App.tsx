import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import HomePage from "./components/home/HomePage.tsx";
import AuthForm from "./components/auth/AuthForm.tsx";
import CreateAuction from "./components/auction/CreateAuction.tsx";
import GroupDetail from "./components/groups/GroupDetail.tsx";
import AuctionDetail from "./components/auction/AuctionDetail.tsx";
import {Toaster} from "react-hot-toast";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import UpdateAuction from "./components/auction/UpdateAuction.tsx";
import Users from "./components/users/Users.tsx";
import UserDetail from "./components/profile/UserDetail.tsx";
import UserGroups from "./components/groups/UserGroups.tsx";
import BidFollowAuctions from "./components/profile/bidOrFollow/BidFollowAuctions.tsx";
import CreateGroup from "./components/groups/CreateGroup.tsx";
import {Role} from "./types/user.ts";
import User from "./components/users/User.tsx";

function RootLayout() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}

const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [
            {path: "/", element: <HomePage/>},
            {path: "/login", element: <AuthForm defaultIsLogin={true}/>},
            {path: "/register", element: <AuthForm defaultIsLogin={false}/>},
            {path: "/aukce/detail/:productId", element: <AuctionDetail/>},
            {path: "/uzivatel/:userId", element: <User />},

            {
                element: <ProtectedRoute />,
                children: [
                    {path: "/profil", element: <Navigate to="/profile/osobni-udaje" replace/>},
                    {path: "/profil/osobni-udaje", element: <UserDetail />},
                    {path: "/profil/moje-prihozy", element: <BidFollowAuctions />},
                ]
            },

            {
                element: <ProtectedRoute allowedRoles={[Role.Editor, Role.Manager]} />,
                children: [
                    {path: "/profil/skupiny", element: <UserGroups />},
                    {path: "/skupina/:groupId", element: <GroupDetail/>},

                    {path: "/vytvorit-aukci", element: <CreateAuction/>},
                    {path: "/vytvorit-aukci/:groupId", element: <CreateAuction/>},
                    {path: "/upravit-aukci/:productId", element: <UpdateAuction />},
                ]
            },

            {
                element: <ProtectedRoute allowedRoles={[Role.Manager]} />,
                children: [
                    {path: "/vytvorit-skupinu", element: <CreateGroup />},
                    {path: "profil/sprava-uzivatelu", element: <Users />}
                ]
            }
        ]
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