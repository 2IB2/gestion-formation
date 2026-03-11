import Dashboard from '../pages/dashboard'
import ListeFormation from '../pages/listeformation'
import Login from '../pages/login'

import { BrowserRouter,Routes,Route } from 'react-router-dom'
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
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Dashboard username={loggedInUser.username} onLogout={handleLogout} />}/>
                    <Route path='/formation' element={<ListeFormation username={loggedInUser.username} onLogout={handleLogout}/>}/>
                    <Route path='/h' />
                </Routes>
            </BrowserRouter>
        </>
        )
    }

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Login onLogin={handleLogin} />}/>
            
        </Routes>
    </BrowserRouter>
    )
    
}