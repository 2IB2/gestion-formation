import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import ListeFormation from "../pages/listeformation";
import ProtectedRoute from "./protectedroute";
import AjouterAuFormation from "../pages/ajouterauformation";

export default function Board() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) setUser(storedUser);
        } catch {
            localStorage.removeItem("user");
        }
    }, []);

    const handleLogin = (userData) => {
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
                    element={
                        user
                            ? <Dashboard username={user?.username} onLogout={handleLogout}/>
                            : <Login onLogin={handleLogin}/>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard username={user?.username} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/formation"
                    element={
                        <ProtectedRoute user={user}>
                            <ListeFormation username={user?.username} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add"
                    element={
                        <ProtectedRoute user={user}>
                            <AjouterAuFormation username={user?.username} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}