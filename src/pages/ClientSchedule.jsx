import Aside from "../components/aside";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { Get } from "../api/api";
import { Calendar, Clock, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClientSchedule({ user, onLogout }) {
    const [myFormations, setMyFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyFormations();
    }, [user]);

    const fetchMyFormations = async () => {
        setLoading(true);

        try {
            const res = await Get("assignments");
            const all = res.data.assignments || res.data.data || res.data || [];

            // ✅ FIX: safe filtering (important)
            const filtered = all.filter(a =>
                a.participent_id === user?.participent?.id ||
                a.participent_id === user?.id ||
                a.nom?.toLowerCase() === user?.username?.toLowerCase() ||
                a.prenom?.toLowerCase() === user?.username?.toLowerCase()
            );

            setMyFormations(filtered);
        } catch (err) {
            console.error("Error fetching schedule:", err);
            setMyFormations([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Header onLogout={onLogout} user={user} />
            <Aside user={user} />

            <main className="main">

                <header className="page-header">
                    <div>
                        <h1 className="page-title">Mon Emploi du Temps</h1>
                        <p className="page-subtitle">
                            Suivi des formations auxquelles vous êtes inscrit
                        </p>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-overlay">
                        <div className="global-spinner"></div>
                        <p>Chargement...</p>
                    </div>
                ) : (
                    <div className="schedule-container">

                        {/* STATS */}
                        <div className="stats-grid mb-8">

                            <div className="stat-mini-card">
                                <BookOpen size={20} color="#6366f1" />
                                <div>
                                    <span className="stat-label">Total Formations</span>
                                    <span className="stat-value">{myFormations.length}</span>
                                </div>
                            </div>

                            <div className="stat-mini-card">
                                <CheckCircle2 size={20} color="#10b981" />
                                <div>
                                    <span className="stat-label">Actives</span>
                                    <span className="stat-value">{myFormations.length}</span>
                                </div>
                            </div>

                        </div>

                        {/* LIST */}
                        {myFormations.length > 0 ? (
                            <div className="formation-list">

                                {myFormations.map((item, idx) => (
                                    <div key={idx} className="formation-item-card">

                                        <div className="item-main">

                                            <div className="item-icon-box">
                                                <Calendar size={22} />
                                            </div>

                                            <div className="item-details">
                                                <h3>
                                                    {item.formation_title ||
                                                        item.title ||
                                                        "Session de Formation"}
                                                </h3>

                                                <div className="item-meta">
                                                    <span>
                                                        <Clock size={14} />{" "}
                                                        {item.date_debut || "??"} - {item.date_fin || "??"}
                                                    </span>

                                                    <span>
                                                        <BookOpen size={14} />{" "}
                                                        {item.animateur?.prenom ||
                                                            item.animater?.prenom ||
                                                            "Animateur"}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="item-status">
                                            <span className="status-tag active">
                                                Inscrit
                                            </span>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="empty-state-card">
                                <AlertCircle size={48} color="#94a3b8" />
                                <h3>Aucune Formation</h3>
                                <p>Vous n’êtes inscrit à aucune formation pour le moment.</p>
                            </div>
                        )}

                    </div>
                )}

            </main>

            {/* STYLE */}
            <style jsx="true">{`
                .schedule-container {
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-mini-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 18px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .stat-label {
                    font-size: 11px;
                    color: #94a3b8;
                    text-transform: uppercase;
                }

                .stat-value {
                    font-size: 18px;
                    font-weight: bold;
                }

                .formation-list {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .formation-item-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 20px;
                    border-radius: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: 0.2s;
                }

                .formation-item-card:hover {
                    transform: translateY(-2px);
                    border-color: #6366f1;
                }

                .item-main {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .item-icon-box {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    border-radius: 12px;
                }

                .item-meta {
                    display: flex;
                    gap: 20px;
                    font-size: 12px;
                    color: #64748b;
                }

                .status-tag {
                    padding: 6px 12px;
                    background: #ecfdf5;
                    color: #10b981;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .empty-state-card {
                    text-align: center;
                    padding: 60px;
                    color: #94a3b8;
                    background: white;
                    border: 2px dashed #e2e8f0;
                    border-radius: 16px;
                }
            `}</style>
        </div>
    );
}