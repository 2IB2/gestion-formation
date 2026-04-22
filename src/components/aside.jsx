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

                <NavLink 
                    to="/add-participant"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Ajouter Participant
                </NavLink>

                <NavLink 
                    to="/affecter-participant"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Affecter Participant
                </NavLink>

                <NavLink 
                    to="/hebergement"
                    className={({isActive}) => isActive ? "active" : ""}
                >
                    Hébergement
                </NavLink>

            </nav>

        </aside>
    );
}