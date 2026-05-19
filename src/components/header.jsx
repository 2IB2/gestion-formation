import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'
import { LogOut, Bell, UserCircle, Search, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Header({ user, onLogout }) {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    
    const role = user?.role?.toLowerCase() || 'admin';
    const displayRole = role === 'admin' ? 'Administrateur' : (role === 'formateur' || role === 'trainer' || role === 'animateur' ? 'Animateur' : 'Participant');

    useEffect(() => {
        // Fetch notifications for the participant dynamically
        const isClient = role === 'client' || role === 'participant';
        if (isClient && user?.participent?.id) {
            axios.get(`http://localhost:8000/api/assignments`)
                .then(res => {
                    const allAssignments = res.data.assignments || res.data || [];
                    const myAssignments = allAssignments.filter(a => a.participent_id === user.participent.id);
                    const notifs = myAssignments.map(a => ({
                        id: a.id,
                        title: "Nouvelle Affectation",
                        message: `Vous avez été ajouté à la formation "${a.formation_title || a.title}"`,
                        time: "Récemment"
                    }));
                    setNotifications(notifs);
                })
                .catch(err => console.error("Error fetching header assignments:", err));
        }
    }, [user, role]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = () => {
        onLogout();
        navigate("/");
    };

    return (
        <header className="header-modest">
            <div className="header-content">
                <div className="header-left">
                    <img src={logo} className="header-logo" alt="Logo" />
                    <h2 className="header-title">Gestion de Formations</h2>
                </div>
                
                <div className="header-right">
                    <div className="header-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Rechercher des formations..." />
                    </div>
                    
                    <div className="notifications-container" ref={dropdownRef}>
                        <button 
                            className="icon-action-btn" 
                            title="Notifications"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && <span className="notification-dot"></span>}
                        </button>

                        {showNotifications && (
                            <div className="notifications-dropdown">
                                <div className="dropdown-header">
                                    <h3>Notifications ({notifications.length})</h3>
                                    {notifications.length > 0 && (
                                        <button className="clear-btn" onClick={() => setNotifications([])}>Marquer comme lu</button>
                                    )}
                                </div>
                                <div className="dropdown-body">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div key={n.id} className="notification-item">
                                                <div className="notification-icon">
                                                    <Info size={16} color="#3b82f6" />
                                                </div>
                                                <div className="notification-info">
                                                    <h4 className="notification-item-title">{n.title}</h4>
                                                    <p className="notification-item-msg">{n.message}</p>
                                                    <span className="notification-item-time">{n.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-notifications">
                                            Aucune nouvelle notification.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{user?.username || 'Admin'}</span>
                            <span className="user-role">{displayRole}</span>
                        </div>
                        <UserCircle size={32} className="user-avatar" />
                    </div>

                    <div className="divider"></div>

                    <button onClick={handleClick} className="logout-btn">
                        <LogOut size={16} style={{ marginRight: '8px' }} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
            
            <style jsx="true">{`
                .header-modest {
                    position: fixed;
                    top: 0;
                    right: 0;
                    left: 240px;
                    height: 80px;
                    background: white;
                    border-bottom: 1px solid var(--border-color);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    padding: 0 40px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .header-logo {
                    width: 42px;
                    height: auto;
                    object-fit: contain;
                }
                .header-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: #0f172a;
                    letter-spacing: -0.025em;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                
                .header-search {
                    position: relative;
                    margin-right: 12px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }
                .header-search input {
                    background: #f1f5f9;
                    border: 1px solid transparent;
                    border-radius: 99px;
                    padding: 10px 16px 10px 38px;
                    font-size: 0.875rem;
                    width: 240px;
                    transition: all 0.2s;
                }
                .header-search input:focus {
                    background: white;
                    border-color: var(--primary);
                    width: 300px;
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .notifications-container {
                    position: relative;
                }
                .icon-action-btn {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    position: relative;
                    transition: all 0.2s;
                }
                .icon-action-btn:hover {
                    background: #f1f5f9;
                    color: var(--primary);
                }
                .notification-dot {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border: 2px solid white;
                    border-radius: 50%;
                }

                .notifications-dropdown {
                    position: absolute;
                    top: 50px;
                    right: 0;
                    width: 320px;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                    z-index: 1002;
                    overflow: hidden;
                    animation: slideDown 0.2s ease-out;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dropdown-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .dropdown-header h3 {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    margin: 0;
                    color: #0f172a;
                }
                .clear-btn {
                    background: transparent;
                    border: none;
                    color: var(--primary);
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .dropdown-body {
                    max-height: 280px;
                    overflow-y: auto;
                }
                .notification-item {
                    display: flex;
                    gap: 12px;
                    padding: 16px;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.2s;
                }
                .notification-item:hover {
                    background: #f8fafc;
                }
                .notification-icon {
                    width: 28px;
                    height: 28px;
                    background: #eff6ff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .notification-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .notification-item-title {
                    font-size: 0.8125rem;
                    font-weight: 700;
                    margin: 0;
                    color: #0f172a;
                }
                .notification-item-msg {
                    font-size: 0.8125rem;
                    color: #475569;
                    margin: 0;
                    line-height: 1.4;
                }
                .notification-item-time {
                    font-size: 0.6875rem;
                    color: #94a3b8;
                    margin-top: 4px;
                }
                .no-notifications {
                    padding: 32px 16px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .user-profile:hover {
                    background: #f8fafc;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .user-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #0f172a;
                }
                .user-role {
                    font-size: 0.75rem;
                    color: #64748b;
                }
                .user-avatar {
                    color: #94a3b8;
                }

                .divider {
                    width: 1px;
                    height: 24px;
                    background: var(--border-color);
                    margin: 0 4px;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    background: transparent;
                    border: 1px solid transparent;
                    color: #ef4444;
                    padding: 8px 16px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: #fef2f2;
                    border-color: #fee2e2;
                }
            `}</style>
        </header>
    )
}