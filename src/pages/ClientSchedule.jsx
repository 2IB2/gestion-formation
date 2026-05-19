import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get } from "../api/api"
import { Calendar, Clock, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClientSchedule({ user, onLogout }) {
    const [myFormations, setMyFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyData = async () => {
            setLoading(true);
            try {
                // In a real app, we'd have a specific endpoint like 'my-assignments'
                const res = await Get('assignments');
                const all = res.data.assignments || res.data.data || res.data || [];
                
                // Filtering based on username match and participant ID
                const filtered = all.filter(a => 
                    a.participent_id === user?.participent?.id ||
                    a.nom?.toLowerCase() === user?.username?.toLowerCase() || 
                    a.prenom?.toLowerCase() === user?.username?.toLowerCase()
                );
                
                setMyFormations(filtered);
            } catch (err) {
                console.error("Error fetching schedule:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyData();
    }, [user]);

    return (
        <div className="dashboard-layout">
            <Header onLogout={onLogout} user={user} />
            <Aside user={user} />

            <main className="main">
                <header className="page-header">
                    <div>
                        <h1 className="page-title">Mon Emploi du Temps</h1>
                        <p className="page-subtitle">Suivez la progression de vos formations et les sessions à venir.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-overlay">
                        <div className="global-spinner"></div>
                        <p>Chargement de votre emploi du temps...</p>
                    </div>
                ) : (
                    <div className="schedule-container">
                        <div className="stats-grid mb-8">
                            <div className="stat-mini-card">
                                <BookOpen size={20} color="#6366f1" />
                                <div className="stat-content">
                                    <span className="stat-label">Total des Formations</span>
                                    <span className="stat-value">{myFormations.length}</span>
                                </div>
                            </div>
                            <div className="stat-mini-card">
                                <CheckCircle2 size={20} color="#10b981" />
                                <div className="stat-content">
                                    <span className="stat-label">Terminées</span>
                                    <span className="stat-value">0</span>
                                </div>
                            </div>
                        </div>

                        {myFormations.length > 0 ? (
                            <div className="formation-list">
                                {myFormations.map((item, idx) => (
                                    <div key={idx} className="formation-item-card">
                                        <div className="item-main">
                                            <div className="item-icon-box">
                                                <Calendar size={24} />
                                            </div>
                                            <div className="item-details">
                                                <h3>{item.formation_title || "Session de Formation"}</h3>
                                                <div className="item-meta">
                                                    <span><Clock size={14} /> Heure de Session : 09:00 - 17:00</span>
                                                    <span><BookOpen size={14} /> Animateur : {item.animateur || 'Animateur Assigné'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-status">
                                            <span className="status-tag active">Inscrit</span>
                                            <button className="view-details-btn">Voir les Supports</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-card">
                                <AlertCircle size={48} color="#94a3b8" />
                                <h3>Aucune Inscription Trouvée</h3>
                                <p>Vous n'êtes actuellement inscrit à aucun programme de formation actif.</p>
                                <button className="primary-btn mt-4" style={{padding: '12px 24px'}}>Contacter l'Administration</button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <style jsx="true">{`
                .schedule-container {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }
                .stat-mini-card {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .stat-label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .formation-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .formation-item-card {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }
                .formation-item-card:hover {
                    box-shadow: var(--shadow-md);
                    border-color: var(--primary);
                    transform: translateX(4px);
                }
                .item-main {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .item-icon-box {
                    width: 56px;
                    height: 56px;
                    background: #f1f5f9;
                    color: var(--primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .item-details h3 {
                    margin: 0 0 6px 0;
                    font-size: 1.125rem;
                }
                .item-meta {
                    display: flex;
                    gap: 20px;
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                }
                .item-meta span {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .item-status {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 12px;
                }
                .status-tag {
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .status-tag.active {
                    background: #ecfdf5;
                    color: #10b981;
                }
                .view-details-btn {
                    background: transparent;
                    color: var(--primary);
                    border: 1px solid var(--primary);
                    padding: 6px 16px;
                    font-size: 0.8125rem;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .view-details-btn:hover {
                    background: var(--primary);
                    color: white;
                }
                .empty-state-card {
                    background: white;
                    padding: 60px;
                    border-radius: 20px;
                    border: 1px dashed var(--border-color);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .empty-state-card h3 { margin: 20px 0 8px 0; }
                .empty-state-card p { color: var(--text-muted); max-width: 300px; }
            `}</style>
        </div>
    );
}
