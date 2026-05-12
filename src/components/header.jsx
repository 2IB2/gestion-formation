import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'
import { LogOut, Bell, UserCircle, Search } from "lucide-react";

export default function Header({username, onLogout}) {
    const navigate = useNavigate();
    
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
                        <input type="text" placeholder="Rechercher des formations, participants..." />
                    </div>
                    
                    <button className="icon-action-btn" title="Notifications">
                        <Bell size={20} />
                        <span className="notification-dot"></span>
                    </button>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{username || 'Admin'}</span>
                            <span className="user-role">Administrateur Système</span>
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