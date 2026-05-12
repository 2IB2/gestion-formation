import Header from '../components/header'
import Aside from '../components/aside'
import Main from '../components/main'
import '../styles/dashboard.css'

function Dashboard({ user, onLogout }) {
    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={user?.username} />

            <div className="dashboard-body">
                <Aside user={user} />
                <Main user={user} className="mt-5 "/>
            </div>
        </div>
    )
}

export default Dashboard