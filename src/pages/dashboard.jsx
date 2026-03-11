import React from 'react'
import Header from '../components/header'
import Aside from '../components/aside'
import Main from '../components/main'
import '../styles/dashboard.css'
function Dashboard({ username, onLogout }) {
    return (
        <div className="position-relative">
            <Header onLogout={onLogout} username={username}/>
            <Aside/>
            <Main />
        </div>
    )
}

export default Dashboard