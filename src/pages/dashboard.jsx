import Header from '../components/header'
import Aside from '../components/aside'
import Main from '../components/main'
import '../styles/dashboard.css'

function Dashboard({ username, onLogout }) {
    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={username} />

            <div className="dashboard-body">
                <Aside />
                <Main className="mt-5"/>
            </div>
        </div>
    )
}

export default Dashboard