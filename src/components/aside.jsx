import "../styles/dashboard.css"

import { Link } from "react-router-dom"
export default function Aside(){
    return(
        <aside className="sidebar text-white p-3 position-fixed pt-5" style={{
                    top: "100px",
                    left: "0",
                    height: "100vh"
                }}>
                <ul className="nav flex-column mt-4">
                    <li className="nav-item">
                        {/* <a className="nav-link text-white" href="#">Dashboard</a> */}
                        <Link className="text-light" to='/'>Dashboard</Link>
                    </li>

                    <li className="nav-item">
                        {/* <a className="nav-link text-white" href="#">Formations</a> */}
                        <Link className="text-light" to='/formation'>Formation</Link>
                    </li>

                    <li className="nav-item">
                        {/* <a className="nav-link text-white" href="#">Formateurs</a> */}
                        <Link className="text-light" to='/formateur'>Formateur</Link>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Settings</a>
                    </li>
                </ul>
        </aside>
    )
}