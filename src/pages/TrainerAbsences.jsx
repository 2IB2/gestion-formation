import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post } from "../api/api"
import { Users, Search, Check, X, AlertCircle, ChevronRight } from "lucide-react";

export default function TrainerAbsences({ user, onLogout }) {
    const [formations, setFormations] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        const fetchTrainerFormations = async () => {
            setLoading(true);
            try {
                // In a real app, we'd fetch formations where animateur_id matches user.id
                const res = await Get('formations');
                const all = res.data.formations || res.data.data || res.data || [];
                setFormations(all);
            } catch (err) {
                console.error("Error fetching formations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainerFormations();
    }, []);

    const handleSelectFormation = async (formation) => {
        setSelectedFormation(formation);
        setLoading(true);
        try {
            // Fetch participants assigned to this formation
            const res = await Get('assignments');
            const all = res.data.assignments || res.data.data || res.data || [];
            const filtered = all.filter(a => a.formation_id === formation.id);
            setParticipants(filtered);
        } catch (err) {
            console.error("Error fetching participants:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAbsence = async (participantId, isAbsent) => {
        setMarking(true);
        try {
            // Mocking an absence API call
            // await Post('absences', { formation_id: selectedFormation.id, participant_id: participantId, status: isAbsent ? 'absent' : 'present' });
            
            // Updating local state for immediate feedback
            setParticipants(prev => prev.map(p => 
                p.participent_id === participantId ? { ...p, isAbsent } : p
            ));
        } catch (err) {
            console.error("Error marking absence:", err);
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Header onLogout={onLogout} user={user} />
            <Aside user={user} />

            <main className="main">
                <header className="page-header">
                    <div>
                        <h1 className="page-title">Gestion des Absences</h1>
                        <p className="page-subtitle">Gérez les présences pour vos programmes de formation assignés.</p>
                    </div>
                </header>

                {loading && !selectedFormation ? (
                    <div className="loading-overlay">
                        <div className="global-spinner"></div>
                        <p>Chargement de vos formations...</p>
                    </div>
                ) : (
                    <div className="absences-grid">
                        {!selectedFormation ? (
                            <div className="selection-view">
                                <h3 className="section-title">Sélectionnez un Programme</h3>
                                <div className="formation-grid">
                                    {formations.map(f => (
                                        <div key={f.id} className="formation-select-card" onClick={() => handleSelectFormation(f)}>
                                            <div className="card-info">
                                                <h4>{f.title}</h4>
                                                <p>{f.date_debut} - {f.date_fin}</p>
                                            </div>
                                            <ChevronRight size={20} color="#94a3b8" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="attendance-view">
                                <button className="back-btn mb-4" onClick={() => setSelectedFormation(null)}>
                                    &larr; Retour aux Programmes
                                </button>
                                
                                <div className="modest-card">
                                    <div className="card-header-flex">
                                        <div>
                                            <h3 className="mb-1">{selectedFormation.title}</h3>
                                            <p className="text-muted text-sm">Liste de Présence du {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div className="participant-count">
                                            <Users size={16} />
                                            <span>{participants.length} Étudiants</span>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="p-8 text-center"><div className="global-spinner mx-auto"></div></div>
                                    ) : participants.length > 0 ? (
                                        <div className="table-wrapper mt-6">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Participant</th>
                                                        <th className="text-center">Statut</th>
                                                        <th className="text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {participants.map(p => (
                                                        <tr key={p.participent_id}>
                                                            <td>
                                                                <div className="participant-cell">
                                                                    <div className="avatar-mini">{p.prenom?.[0]}{p.nom?.[0]}</div>
                                                                    <span>{p.prenom} {p.nom}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className={`status-pill ${p.isAbsent ? 'absent' : 'present'}`}>
                                                                    {p.isAbsent ? 'Absent' : 'Présent'}
                                                                </span>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="action-btns">
                                                                    <button 
                                                                        className={`icon-btn present ${!p.isAbsent ? 'active' : ''}`}
                                                                        onClick={() => markAbsence(p.participent_id, false)}
                                                                        title="Marquer comme Présent"
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button 
                                                                        className={`icon-btn absent ${p.isAbsent ? 'active' : ''}`}
                                                                        onClick={() => markAbsence(p.participent_id, true)}
                                                                        title="Marquer comme Absent"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-state p-12">
                                            <AlertCircle size={40} color="#94a3b8" />
                                            <p>Aucun participant n'est inscrit à ce programme.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <style jsx="true">{`
                .absences-grid {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .section-title {
                    font-size: 1.125rem;
                    margin-bottom: 20px;
                    color: var(--text-muted);
                }
                .formation-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 16px;
                }
                .formation-select-card {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .formation-select-card:hover {
                    border-color: var(--primary);
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                }
                .formation-select-card h4 { margin: 0 0 4px 0; color: var(--text-main); }
                .formation-select-card p { font-size: 0.8125rem; color: var(--text-muted); margin: 0; }
                
                .back-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .back-btn:hover { color: var(--primary); }
                
                .card-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .participant-count {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f1f5f9;
                    padding: 6px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #475569;
                }
                
                .participant-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .avatar-mini {
                    width: 32px;
                    height: 32px;
                    background: #e2e8f0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                }
                
                .status-pill {
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .status-pill.present { background: #ecfdf5; color: #10b981; }
                .status-pill.absent { background: #fef2f2; color: #ef4444; }
                
                .action-btns {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn.present:hover, .icon-btn.present.active {
                    background: #10b981;
                    border-color: #10b981;
                    color: white;
                }
                .icon-btn.absent:hover, .icon-btn.absent.active {
                    background: #ef4444;
                    border-color: #ef4444;
                    color: white;
                }
                
                .text-sm { font-size: 0.8125rem; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .empty-state { text-align: center; color: var(--text-muted); }
            `}</style>
        </div>
    );
}
