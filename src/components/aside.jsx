import { NavLink } from "react-router-dom";

export default function Aside() {
    return (
        <aside className="aside">

            <h2 className="logo">Admin</h2>

            <nav className="menu">

                <NavLink 
                    to="/dashboard"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Dashboard
                </NavLink>

                <NavLink 
                    to="/formation"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Formations
                </NavLink>

                <NavLink 
                    to="/add"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Affecter Formations
                </NavLink>

            </nav>

        </aside>
    );
}