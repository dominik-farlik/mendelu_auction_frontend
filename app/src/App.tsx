import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/homePage/HomePage.tsx";
import AuthForm from "./components/auth/AuthForm.tsx";
import { checkIfLoggedInLoader } from "./components/auth/AuthLoader.tsx";

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
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;