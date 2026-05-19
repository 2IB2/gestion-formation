import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete } from "../api/api"
import { Users, GraduationCap, UserPlus, UserMinus, Info, CheckCircle } from "lucide-react";

export default function AffecterParticipant({ user, onLogout }) {
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);
    const [selectedFormationIds, setSelectedFormationIds] = useState([]);
    const [selectedAssignmentIds, setSelectedAssignmentIds] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const [partRes, formRes, assignRes] = await Promise.all([
                    Get('participents'),
                    Get('formations'),
                    Get('assignments')
                ]);
                
                setParticipants(partRes.data.participents || partRes.data.data || partRes.data || []);
                setFormations(formRes.data.formations || formRes.data.data || formRes.data || []);
                setAssignments(assignRes.data.assignments || assignRes.data.data || assignRes.data || []);
            } catch (err) {
                console.error("Error loading enrolment data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await Get('assignments');
            setAssignments(res.data.assignments || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error refreshing assignments:", err);
        }
    };

    const toggleParticipant = (id) => {
        setSelectedParticipantIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleFormation = (id) => {
        setSelectedFormationIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAssignment = (formationId, participantId) => {
        const key = `${formationId}-${participantId}`;
        setSelectedAssignmentIds(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleAffecter = async () => {
        setError("");
        if (selectedParticipantIds.length === 0 || selectedFormationIds.length === 0) {
            setError("Veuillez sélectionner au moins un participant et une formation.");
            return;
        }

        try {
            const promises = [];
            selectedParticipantIds.forEach(pId => {
                selectedFormationIds.forEach(fId => {
                    promises.push(Post('assignments', { participent_id: pId, formation_id: fId }));
                });
            });

            await Promise.all(promises);
            alert("Inscription réussie !");
            setSelectedParticipantIds([]);
            setSelectedFormationIds([]);
            await fetchAssignments();
        } catch (err) {
            console.error("Error assigning participants:", err);
            setError("Une erreur est survenue lors de l'inscription.");
        }
    };

    const handleDesaffecter = async () => {
        setError("");
        if (selectedAssignmentIds.length === 0) {
            setError("Veuillez sélectionner les inscriptions à supprimer.");
            return;
        }

        if (window.confirm("Supprimer les inscriptions sélectionnées ?")) {
            try {
                const promises = [];
                selectedAssignmentIds.forEach(key => {
                    const [fId, pId] = key.split('-');
                    promises.push(Delete('assignments', { formation_id: fId, participent_id: pId }));
                });

                await Promise.all(promises);
                alert("Suppression réussie !");
                setSelectedAssignmentIds([]);
                await fetchAssignments();
            } catch (err) {
                console.error("Error removing assignments:", err);
                setError("Une erreur est survenue lors de la suppression.");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Header onLogout={onLogout} user={user} />
            <Aside user={user} />

            <main className="main">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Préparation du gestionnaire d'inscriptions...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">Gérer les Inscriptions</h1>
                                <p className="page-subtitle">Inscrivez les participants aux formations et suivez les classes actives.</p>
                            </div>
                        </header>

                        <div className="assignment-grid">
                            <div className="selection-card modest-card">
                                <h3 className="section-title"><UserPlus size={18} style={{marginRight: '8px'}} /> Inscription Rapide</h3>
                                
                                <div className="selector-layout">
                                    <div className="selector-column">
                                        <label className="selector-label"><Users size={12} style={{marginRight: '6px'}} /> 1. Sélectionner les Participants</label>
                                        <div className="table-mini-wrapper">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{width: '40px'}}>Sélection</th>
                                                        <th>Nom</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {participants.map(p => (
                                                        <tr 
                                                            key={p.id} 
                                                            onClick={() => toggleParticipant(p.id)} 
                                                            className={selectedParticipantIds.includes(p.id) ? "selected" : ""}
                                                        >
                                                            <td>
                                                                <input type="checkbox" checked={selectedParticipantIds.includes(p.id)} readOnly />
                                                            </td>
                                                            <td className="fw-medium">{p.prenom} {p.nom}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="selector-column">
                                        <label className="selector-label"><GraduationCap size={12} style={{marginRight: '6px'}} /> 2. Sélectionner les Formations</label>
                                        <div className="table-mini-wrapper">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style={{width: '40px'}}>Sélection</th>
                                                        <th>Titre</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formations.map(f => (
                                                        <tr 
                                                            key={f.id} 
                                                            onClick={() => toggleFormation(f.id)} 
                                                            className={selectedFormationIds.includes(f.id) ? "selected" : ""}
                                                        >
                                                            <td>
                                                                <input type="checkbox" checked={selectedFormationIds.includes(f.id)} readOnly />
                                                            </td>
                                                            <td className="fw-medium">{f.title}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {error && <div className="error-box">{error}</div>}

                                <div className="action-row">
                                    <button className="primary-btn" onClick={handleAffecter}>
                                        <CheckCircle size={16} style={{marginRight: '8px'}} /> Inscrire la Sélection
                                    </button>
                                </div>
                            </div>

                            <div className="assignments-card modest-card">
                                <div className="section-header">
                                    <h3 className="section-title"><Info size={18} style={{marginRight: '8px'}} /> Inscriptions Actives</h3>
                                    <button className="delete-btn-text" onClick={handleDesaffecter}>
                                        <UserMinus size={14} style={{marginRight: '6px'}} /> Désinscrire la Sélection
                                    </button>
                                </div>
                                
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{width: '50px'}}>Sélection</th>
                                                <th>Programme de Formation</th>
                                                <th>Nom du Participant</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.length > 0 ? assignments.map((a, index) => (
                                                <tr 
                                                    key={index} 
                                                    onClick={() => toggleAssignment(a.formation_id, a.participent_id)} 
                                                    className={selectedAssignmentIds.includes(`${a.formation_id}-${a.participent_id}`) ? "selected" : ""}
                                                >
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedAssignmentIds.includes(`${a.formation_id}-${a.participent_id}`)} 
                                                            readOnly 
                                                        />
                                                    </td>
                                                    <td className="fw-semibold">{a.formation_title}</td>
                                                    <td>{a.prenom} {a.nom}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="empty-row">Aucune inscription active trouvée.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <style jsx="true">{`
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
                .modest-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 32px;
                    box-shadow: var(--shadow-sm);
                }
                .assignment-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    font-size: 1.125rem;
                    margin-bottom: 24px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                    margin-top: 0;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .selector-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                    margin-bottom: 24px;
                }
                .selector-label {
                    display: flex;
                    align-items: center;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-main);
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    letter-spacing: 0.025em;
                }
                .table-mini-wrapper {
                    height: 300px;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background: white;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background: #f8fafc;
                    padding: 10px 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-align: left;
                    position: sticky;
                    top: 0;
                    border-bottom: 1px solid var(--border-color);
                    z-index: 5;
                }
                td {
                    padding: 12px;
                    font-size: 0.875rem;
                    border-bottom: 1px solid var(--border-color);
                }
                tr:last-child td { border-bottom: none; }
                tr:hover { background: #f8fafc; cursor: pointer; }
                tr.selected { background: #eff6ff; }
                
                .error-box {
                    background: #fef2f2;
                    color: #ef4444;
                    padding: 14px;
                    border-radius: var(--radius-sm);
                    font-size: 0.875rem;
                    border: 1px solid #fee2e2;
                    margin-bottom: 20px;
                }
                .action-row {
                    display: flex;
                    justify-content: center;
                    padding-top: 12px;
                }
                .primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 64px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .primary-btn:hover { 
                    background: var(--primary-hover); 
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                
                .delete-btn-text {
                    background: transparent;
                    border: 1px solid #fee2e2;
                    color: #ef4444;
                    padding: 8px 16px;
                    border-radius: var(--radius-sm);
                    font-size: 0.8125rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.2s;
                }
                .delete-btn-text:hover { background: #fef2f2; }
                
                .table-wrapper {
                    max-height: 500px;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: white;
                }
                .fw-semibold { font-weight: 600; }
                .fw-medium { font-weight: 500; }
                .empty-row { text-align: center; color: var(--text-muted); padding: 60px; }
                
                svg { 
                    display: inline-block;
                    vertical-align: middle;
                    stroke: currentColor;
                    stroke-width: 2px;
                }
            `}</style>
        </div>
    );
}

