import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Zde může být váš loading spinner */}
                <p className="text-gray-500 font-bold">Ověřuji přihlášení...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Přesměrujeme na login, ale uložíme si odkud chtěl uživatel přijít
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}