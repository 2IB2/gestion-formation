import "../styles/dashboard.css"
export default function Aside(){
    return(
        <aside className="sidebar text-white p-3 position-fixed pt-5" style={{
                    top: "100px",
                    left: "0",
                    height: "100vh"
                }}>
                <ul className="nav flex-column mt-4">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Dashboard</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Formations</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Formateurs</a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Settings</a>
                    </li>
                </ul>
        </aside>
    )
}