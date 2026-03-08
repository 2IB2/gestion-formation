import Dashboard from '../pages/dashboard'
import Login from '../pages/login'
import { useState, useEffect } from 'react'
export default function Board() {
    const [loggedInUser, setLoggedInUser] = useState(null)

    function handleLogin(user) {
        console.log('login:', user)
        setLoggedInUser(user)
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("user");
        setLoggedInUser(null)
    }

    if (loggedInUser) {
        return (
            <Dashboard username={loggedInUser.username} onLogout={handleLogout} />
        )
    }

    return <Login onLogin={handleLogin} />
}