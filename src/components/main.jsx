import React, { useEffect, useState } from "react";
import { Get } from "../api/api";
import { 
    Users, 
    BookOpen, 
    Hotel, 
    TrendingUp, 
    Calendar, 
    Clock, 
    Award,
    CheckCircle,
    ClipboardList,
    ArrowRight
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Main({ user, className }) {
    const [formations, setFormations] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedFormationId, setExpandedFormationId] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        participants: 0,
        upcoming: 0
    });

    const role = user?.role?.toLowerCase() || 'admin';
    const isAdmin = role === 'admin';
    const isTrainer = role === 'formateur' || role === 'trainer' || role === 'animateur';
    const isClient = role === 'client' || role === 'participant';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [formationsRes, participantsRes, assignmentsRes] = await Promise.allSettled([
                    Get('formations'),
                    Get('participents'),
                    Get('assignments')
                ]);

                let fetchedFormations = [];
                let fetchedParticipantsCount = 0;
                let fetchedAssignments = [];

                if (formationsRes.status === 'fulfilled' && formationsRes.value?.data) {
                    const rawData = formationsRes.value.data;
                    fetchedFormations = rawData.formations || rawData.data || rawData || [];
                }

                if (participantsRes.status === 'fulfilled' && participantsRes.value?.data) {
                    const rawData = participantsRes.value.data;
                    const participentsList = rawData.participents || rawData.data || rawData || [];
                    fetchedParticipantsCount = Array.isArray(participentsList) ? participentsList.length : 0;
                }

                if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value?.data) {
                    const rawData = assignmentsRes.value.data;
                    fetchedAssignments = rawData.assignments || rawData.data || rawData || [];
                    setAssignments(fetchedAssignments);
                }

                const today = new Date();
                const safeFormations = Array.isArray(fetchedFormations) ? fetchedFormations : [];

                if (isClient) {
                    const myAssignments = fetchedAssignments.filter(a => 
                        a.participent_id === user?.participent?.id || 
                        a.username === user?.username ||
                        (user?.nom && a.nom === user.nom)
                    );
                    const myFormationIds = myAssignments.map(a => a.formation_id);
                    const myFormations = safeFormations.filter(f => myFormationIds.includes(f.id));
                    setFormations(myFormations);
                } else if (isTrainer) {
                    const myFormations = safeFormations.filter(f => 
                        f.animateur_id === user?.animater?.id || 
                        f.animateur === user?.username ||
                        (user?.nom && f.animateur?.includes(user.nom))
                    );
                    setFormations(myFormations);
                } else {
                    setFormations(safeFormations);
                }

                const active = safeFormations.filter(f => {
                    if (!f.date_debut || !f.date_fin) return false;
                    const start = new Date(f.date_debut);
                    const end = new Date(f.date_fin);
                    return today >= start && today <= end;
                }).length;

                const upcoming = safeFormations.filter(f => {
                    if (!f.date_debut) return false;
                    return new Date(f.date_debut) > today;
                }).length;

                setStats({
                    total: safeFormations.length,
                    active,
                    participants: fetchedParticipantsCount,
                    upcoming
                });

            } catch (err) {
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isClient, isTrainer]);

    return (
        <div className={`main dashboard-content ${className || ""}`}>
            <header className="dashboard-header mb-8">
                <div className="welcome-section">
                    <h1 className="welcome-title">Bienvenue, {user?.username || 'Utilisateur'} !</h1>
                    <p className="welcome-subtitle">
                        {isAdmin ? "Voici ce qui se passe avec vos programmes de formation aujourd'hui." : 
                         isTrainer ? "Gérez vos sessions et suivez la présence des étudiants." :
                         "Restez à jour avec votre emploi du temps et vos supports de formation."}
                    </p>
                </div>
                <div className="date-display">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement de votre tableau de bord personnalisé...</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {isAdmin && (
                        <>
                            <div className="stat-card premium-card">
                                <div className="card-icon blue">
                                    <Users size={24} />
                                </div>
                                <div className="card-info">
                                    <span className="label">Total Participants</span>
                                    <h2 className="value">{stats.participants}</h2>
                                    <span className="trend positive"><TrendingUp size={14} /> +12% depuis le mois dernier</span>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon purple">
                                    <BookOpen size={24} />
                                </div>
                                <div className="card-info">
                                    <span className="label">Formations Actives</span>
                                    <h2 className="value">{stats.total}</h2>
                                    <span className="trend positive"><TrendingUp size={14} /> +4 nouvelles cette semaine</span>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon green">
                                    <Hotel size={24} />
                                </div>
                                <div className="card-info">
                                    <span className="label">Sessions en Cours</span>
                                    <h2 className="value">{stats.active}</h2>
                                    <span className="trend neutral">Suivi en Direct</span>
                                </div>
                            </div>
                        </>
                    )}

                    {isTrainer && (
                        <>
                            <div className="wide-card premium-card">
                                <div className="card-header-flex">
                                    <h3 className="section-title"><Clock size={20} /> Prochaine Session</h3>
                                    <NavLink to="/absences" className="action-link">Gérer les Absences <ArrowRight size={16} /></NavLink>
                                </div>
                                 <div className="session-info-box mt-4">
                                    <div className="session-details">
                                        <h4>{formations[0]?.title || "Aucune Session Active"}</h4>
                                        <p><Calendar size={14} /> Demain à 09:00</p>
                                        <p><Users size={14} /> {formations[0] ? assignments.filter(a => a.formation_id === formations[0].id).length : 0} Étudiants Inscrits</p>
                                    </div>
                                    <div className="session-action">
                                        <button className="primary-btn-sm" onClick={() => setExpandedFormationId(formations[0]?.id)}>
                                            Voir la liste
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon indigo">
                                    <ClipboardList size={24} />
                                </div>
                                <div className="card-info">
                                    <span className="label">Mes Formations</span>
                                    <h2 className="value">{formations.length}</h2>
                                    <span className="trend neutral">Actuellement responsable</span>
                                </div>
                            </div>
                        </>
                    )}

                    {isClient && (
                        <>
                            <div className="wide-card premium-card">
                                <div className="card-header-flex">
                                    <h3 className="section-title"><Award size={20} /> Votre Progression</h3>
                                    <NavLink to="/schedule" className="action-link">Voir l'Emploi du Temps <ArrowRight size={16} /></NavLink>
                                </div>
                                <div className="progress-container mt-4">
                                    <div className="progress-info">
                                        <span>{formations[0]?.title || "Formation en Management"}</span>
                                        <span>65% Terminé</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{width: '65%'}}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon green">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="card-info">
                                    <span className="label">Inscriptions</span>
                                    <h2 className="value">{formations.length}</h2>
                                    <span className="trend neutral">Cours actifs</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="recent-table-card premium-card full-width">
                        <div className="recent-header">
                            <h3>{isAdmin ? 'Formations Récentes' : isTrainer ? 'Mon Emploi du Temps de Formation' : 'Mes Sessions Inscrites'}</h3>
                            <button className="view-all-btn">Exporter les Données</button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom de la Formation</th>
                                        <th>Durée</th>
                                        <th>Période</th>
                                        <th>Animateur</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(formations.length > 0 ? formations.slice(0, 5) : []).map((f, index) => {
                                        const isUpcoming = new Date(f.date_debut) > new Date();
                                        const participantsInFormation = assignments.filter(a => a.formation_id === f.id);
                                        return (
                                            <React.Fragment key={f.id || index}>
                                                <tr 
                                                    style={{ cursor: isTrainer ? 'pointer' : 'default' }}
                                                    onClick={() => {
                                                        if (isTrainer) {
                                                            setExpandedFormationId(expandedFormationId === f.id ? null : f.id);
                                                        }
                                                    }}
                                                >
                                                    <td className="font-semibold">{f.title}</td>
                                                    <td>{f.duree}</td>
                                                    <td>{f.date_debut} - {f.date_fin}</td>
                                                    <td>{f.animateur || 'Animateur Assigné'}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                            <span className={`status-pill ${isUpcoming ? 'upcoming' : 'active'}`}>
                                                                {isUpcoming ? 'À Venir' : 'En Cours'}
                                                            </span>
                                                            {isTrainer && (
                                                                <span className="participants-badge-trigger" style={{
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    color: 'var(--primary)',
                                                                    background: '#eef2ff',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '99px'
                                                                }}>
                                                                    {participantsInFormation.length} Étudiants {expandedFormationId === f.id ? '▲' : '▼'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isTrainer && expandedFormationId === f.id && (
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '0px', background: '#f8fafc' }}>
                                                            <div style={{ padding: '20px 24px', borderLeft: '4px solid var(--primary)', background: '#f8fafc' }}>
                                                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <Users size={16} color="var(--primary)" /> 
                                                                    Participants Inscrits à cette Formation ({participantsInFormation.length})
                                                                </h4>
                                                                {participantsInFormation.length > 0 ? (
                                                                    <table style={{ width: '100%', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                                                                        <thead>
                                                                            <tr style={{ background: '#f1f5f9' }}>
                                                                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Nom Complet</th>
                                                                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Email</th>
                                                                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>Établissement / Téléphone</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {participantsInFormation.map(p => (
                                                                                <tr key={p.id || p.participent_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                                                    <td style={{ padding: '10px 12px', fontSize: '0.85rem', fontWeight: '600' }}>{p.prenom} {p.nom}</td>
                                                                                    <td style={{ padding: '10px 12px', fontSize: '0.85rem' }}>{p.email}</td>
                                                                                    <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#64748b' }}>{p.etablissement || p.telephone || '-'}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>Aucun participant inscrit à cette formation.</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {formations.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-muted">
                                                Aucune formation active trouvée dans le système.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .dashboard-content {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .welcome-title {
                    font-size: 2rem;
                    margin-bottom: 8px;
                    color: #0f172a;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                }
                .welcome-subtitle {
                    color: var(--text-muted);
                    font-size: 1rem;
                }
                .date-display {
                    background: white;
                    padding: 8px 16px;
                    border-radius: 99px;
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.875rem;
                    color: #475569;
                    font-weight: 600;
                    box-shadow: var(--shadow-sm);
                }
                
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    color: var(--text-muted);
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f1f5f9;
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 16px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }
                
                .premium-card {
                    background: white;
                    border-radius: 20px;
                    padding: 28px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary);
                }
                
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .card-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card-icon.blue { background: #eff6ff; color: #2563eb; }
                .card-icon.purple { background: #f5f3ff; color: #7c3aed; }
                .card-icon.green { background: #f0fdf4; color: #16a34a; }
                .card-icon.indigo { background: #eef2ff; color: #4f46e5; }
                
                .label {
                    display: block;
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }
                .value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 8px 0;
                }
                .trend {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .trend.positive { color: #10b981; }
                .trend.neutral { color: #64748b; }

                .wide-card { grid-column: span 2; }
                .full-width { grid-column: 1 / -1; }
                
                .card-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.125rem;
                    font-weight: 700;
                }
                .action-link {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .session-info-box {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #f1f5f9;
                }
                .session-details h4 { margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 700; }
                .session-details p { 
                    margin: 6px 0; 
                    font-size: 0.875rem; 
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .primary-btn-sm {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
                }

                .progress-container {
                    padding: 24px;
                    background: #f8fafc;
                    border-radius: 16px;
                }
                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 14px;
                    font-size: 0.9375rem;
                    font-weight: 700;
                }
                .progress-bar-bg {
                    height: 10px;
                    background: #e2e8f0;
                    border-radius: 99px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: 99px;
                    transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .recent-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .recent-header h3 { font-size: 1.25rem; font-weight: 700; }
                .view-all-btn {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #64748b;
                    background: #f1f5f9;
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                }
                .view-all-btn:hover { background: #e2e8f0; }

                .status-pill {
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .status-pill.active { background: #ecfdf5; color: #059669; }
                .status-pill.upcoming { background: #fffbeb; color: #d97706; }

                @media (max-width: 1024px) {
                    .wide-card { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
}