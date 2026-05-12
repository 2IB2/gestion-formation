import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import ListeFormation from "../pages/listeformation";
import ProtectedRoute from "./protectedroute";
import AjouterAuFormation from "../pages/ajouterauformation";
import AjouterParticipant from "../pages/AjouterParticipant";
import AffecterParticipant from "../pages/AffecterParticipant";
import Hebergement from "../pages/Hebergement";
import ClientSchedule from "../pages/ClientSchedule";
import TrainerAbsences from "../pages/TrainerAbsences";

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
                            ? <Dashboard user={user} onLogout={handleLogout}/>
                            : <Login onLogin={handleLogin}/>
                    }
                />

                <Route
                    path="/login"
                    element={
                        user
                            ? <Dashboard user={user} onLogout={handleLogout}/>
                            : <Login onLogin={handleLogin}/>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/formation"
                    element={
                        <ProtectedRoute user={user}>
                            <ListeFormation user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add"
                    element={
                        <ProtectedRoute user={user}>
                            <AjouterAuFormation user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-participant"
                    element={
                        <ProtectedRoute user={user}>
                            <AjouterParticipant user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/affecter-participant"
                    element={
                        <ProtectedRoute user={user}>
                            <AffecterParticipant user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hebergement"
                    element={
                        <ProtectedRoute user={user}>
                            <Hebergement user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/schedule"
                    element={
                        <ProtectedRoute user={user}>
                            <ClientSchedule user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/absences"
                    element={
                        <ProtectedRoute user={user}>
                            <TrainerAbsences user={user} onLogout={handleLogout}/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}