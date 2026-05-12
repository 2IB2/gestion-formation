import { NavLink } from "react-router-dom";
import { 
    LayoutDashboard, 
    GraduationCap, 
    Link2, 
    UserPlus, 
    Users, 
    Hotel, 
    ShieldCheck,
    Settings,
    HelpCircle,
    CalendarCheck,
    CalendarDays
} from "lucide-react";

export default function Aside({ user }) {
    const role = user?.role?.toLowerCase() || 'admin';
    const isAdmin = role === 'admin';
    const isTrainer = role === 'formateur' || role === 'trainer';
    const isClient = role === 'client' || role === 'participant';

    return (
        <aside className="aside-premium">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <ShieldCheck size={24} color="white" />
                </div>
                <div className="brand-text">
                    <span className="brand-name">Nexus</span>
                    <span className="brand-tagline">Gestion de Formations</span>
                </div>
            </div>

            <div className="sidebar-scroll">
                <nav className="sidebar-menu">
                    <div className="menu-group">
                        <span className="menu-label">Aperçu</span>
                        <NavLink 
                            to="/dashboard"
                            className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                        >
                            <LayoutDashboard size={20} className="item-icon" />
                            <span>Tableau de bord</span>
                        </NavLink>
                    </div>

                    {isAdmin && (
                        <div className="menu-group">
                            <span className="menu-label">Administration</span>
                            <NavLink 
                                to="/formation"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <GraduationCap size={20} className="item-icon" />
                                <span>Liste des Formations</span>
                            </NavLink>

                            <NavLink 
                                to="/add"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <Link2 size={20} className="item-icon" />
                                <span>Affecter une Formation</span>
                            </NavLink>

                            <NavLink 
                                to="/add-participant"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <UserPlus size={20} className="item-icon" />
                                <span>Participants</span>
                            </NavLink>

                            <NavLink 
                                to="/affecter-participant"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <Users size={20} className="item-icon" />
                                <span>Inscriptions</span>
                            </NavLink>

                            <NavLink 
                                to="/hebergement"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <Hotel size={20} className="item-icon" />
                                <span>Hébergement</span>
                            </NavLink>
                        </div>
                    )}

                    {isTrainer && (
                        <div className="menu-group">
                            <span className="menu-label">Espace Formateur</span>
                            <NavLink 
                                to="/absences"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <CalendarCheck size={20} className="item-icon" />
                                <span>Gestion Absences</span>
                            </NavLink>
                            <NavLink 
                                to="/formation"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <GraduationCap size={20} className="item-icon" />
                                <span>Mes Formations</span>
                            </NavLink>
                        </div>
                    )}

                    {isClient && (
                        <div className="menu-group">
                            <span className="menu-label">Espace Client</span>
                            <NavLink 
                                to="/schedule"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <CalendarDays size={20} className="item-icon" />
                                <span>Emploi du Temps</span>
                            </NavLink>
                            <NavLink 
                                to="/hebergement"
                                className={({isActive}) => `menu-item ${isActive ? "active" : ""}`}
                            >
                                <Hotel size={20} className="item-icon" />
                                <span>Mon Hébergement</span>
                            </NavLink>
                        </div>
                    )}
                    
                    
                </nav>
            </div>

            <style jsx="true">{`
                .aside-premium {
                    position: fixed;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 240px;
                    background: #0f172a;
                    color: #94a3b8;
                    display: flex;
                    flex-direction: column;
                    z-index: 1001;
                    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
                }
                
                .sidebar-brand {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    padding: 0 24px;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .brand-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .brand-name {
                    display: block;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    line-height: 1.2;
                }
                .brand-tagline {
                    font-size: 0.6875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    opacity: 0.6;
                }
                
                .sidebar-scroll {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px 16px;
                }
                
                .sidebar-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    height: 100%;
                }
                
                .menu-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .menu-label {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #475569;
                    margin-bottom: 8px;
                    padding-left: 12px;
                }
                
                .menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .menu-item:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }
                .menu-item.active {
                    color: white;
                    background: var(--primary);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                .menu-item.active .item-icon {
                    color: white;
                }
                .item-icon {
                    color: #475569;
                    transition: color 0.2s;
                }
                .menu-item:hover .item-icon {
                    color: #cbd5e1;
                }
                .menu-item.active .item-icon {
                    color: white;
                }
                
                .menu-item.disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                
                .sidebar-footer {
                    padding: 20px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(0, 0, 0, 0.1);
                }
                .footer-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .status-indicator.online { background: #10b981; }
                .status-text {
                    font-size: 0.75rem;
                    color: #64748b;
                }
                .footer-version {
                    font-size: 0.625rem;
                    color: #475569;
                }
                .mt-auto { margin-top: auto; }
            `}</style>
        </aside>
    );
}
