import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import ListeFormation from "../pages/listeformation";
import ProtectedRoute from "./protectedroute";

export default function Board() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login onLogin={handleLogin} />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard username={user?.name} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/formation"
                    element={
                        <ProtectedRoute user={user}>
                            <ListeFormation username={user?.name} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}