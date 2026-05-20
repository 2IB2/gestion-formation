import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get } from "../api/api"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Users, Check, X, AlertCircle, ChevronRight, Download } from "lucide-react";

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
                const [formationsRes, pivotsRes] = await Promise.all([
                    Get('formations'),
                    Get('pivot')
                ]);
                // console.log("FORMATIONS RES:", formationsRes?.data);
                // console.log("PIVOTS RES:", pivotsRes?.data);
                // console.log("USER ID:", user?.id);

                const allFormations = formationsRes?.data?.formations || formationsRes?.data?.data || formationsRes?.data || [];
                const allPivots = pivotsRes?.data?.pivots || pivotsRes?.data?.data || pivotsRes?.data || [];

                const myFormationIds = allPivots
                    .filter(p => p.animater_id === user?.animater?.id)
                    .map(p => p.formation_id);

                const filtered = allFormations.filter(f => myFormationIds.includes(f.id));

                setFormations(filtered);
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
            const res = await Get('assignments');
            const all = res?.data?.assignments || res?.data?.data || res?.data || [];
            const filtered = all.filter(a => a.formation_id === formation.id);
            setParticipants(filtered);
        } catch (err) {
            console.error("Error fetching participants:", err);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!selectedFormation || participants.length === 0) return;

        const data = participants.map(p => ({
            "Nom": `${p.prenom} ${p.nom}`,
            "Email": p.email || "-",
            "Statut": p.isAbsent ? "Absent" : "Présent",
            "Formation": selectedFormation.title,
            "Date": new Date().toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Absences");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(file, `absences_${selectedFormation.title}.xlsx`);
    };

    const markAbsence = async (participantId, isAbsent) => {
        setMarking(true);
        try {
            setParticipants(prev =>
                prev.map(p =>
                    p.participent_id === participantId
                        ? { ...p, isAbsent }
                        : p
                )
            );
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
                        <p className="page-subtitle">
                            Gérez les présences pour vos programmes de formation.
                        </p>
                    </div>
                </header>

                {loading && !selectedFormation ? (
                    <div className="loading-overlay">
                        <div className="global-spinner"></div>
                        <p>Chargement des formations...</p>
                    </div>
                ) : (
                    <div className="absences-grid">

                        {!selectedFormation ? (
                            <div className="selection-view">
                                <h3 className="section-title">Sélectionnez un Programme</h3>

                                {formations.length === 0 ? (
                                    <div className="empty-state">
                                        <AlertCircle size={40} />
                                        <p>Aucune formation assignée à vous.</p>
                                    </div>
                                ) : (
                                    <div className="formation-grid">
                                        {formations.map(f => (
                                            <div
                                                key={f.id}
                                                className="formation-select-card"
                                                onClick={() => handleSelectFormation(f)}
                                            >
                                                <div>
                                                    <h4>{f.title}</h4>
                                                    <p>{f.date_debut} - {f.date_fin}</p>
                                                </div>
                                                <ChevronRight size={18} color="#94a3b8" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="attendance-view">

                                <button className="back-btn" onClick={() => setSelectedFormation(null)}>
                                    ← Retour
                                </button>

                                <div className="modest-card">

                                    <div className="card-header-flex">
                                        <div>
                                            <h3>{selectedFormation.title}</h3>
                                            <p className="text-sm">
                                                Liste de présence du {new Date().toLocaleDateString()}
                                            </p>
                                        </div>

                                        <button className="export-btn" onClick={exportToExcel}>
                                            <Download size={16} />
                                            Export Excel
                                        </button>

                                        <div className="participant-count">
                                            <Users size={16} />
                                            <span>{participants.length} Étudiants</span>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="p-8 text-center">
                                            <div className="global-spinner"></div>
                                        </div>
                                    ) : participants.length > 0 ? (

                                        <table className="attendance-table">
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
                                                                <div className="avatar-mini">
                                                                    {p.prenom?.[0]}{p.nom?.[0]}
                                                                </div>
                                                                <span>{p.prenom} {p.nom}</span>
                                                            </div>
                                                        </td>

                                                        <td className="text-center">
                                                            <span className={`status-pill ${p.isAbsent ? 'absent' : 'present'}`}>
                                                                {p.isAbsent ? 'Absent' : 'Présent'}
                                                            </span>
                                                        </td>

                                                        <td className="text-right">
                                                            <div className="attendance-toggle">
                                                                <button
                                                                    className={`toggle-btn present ${!p.isAbsent ? 'active' : ''}`}
                                                                    onClick={() => markAbsence(p.participent_id, false)}
                                                                >
                                                                    <Check size={16} />
                                                                    <span>Présent</span>
                                                                </button>

                                                                <button
                                                                    className={`toggle-btn absent ${p.isAbsent ? 'active' : ''}`}
                                                                    onClick={() => markAbsence(p.participent_id, true)}
                                                                >
                                                                    <X size={16} />
                                                                    <span>Absent</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    ) : (
                                        <div className="empty-state">
                                            <AlertCircle size={40} />
                                            <p>Aucun participant trouvé.</p>
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
                    transition: 0.2s;
                }

                .formation-select-card:hover {
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }

                .formation-select-card h4 {
                    margin: 0 0 4px;
                    font-size: 15px;
                    color: #1e293b;
                }

                .formation-select-card p {
                    margin: 0;
                    font-size: 13px;
                    color: #94a3b8;
                }

                .back-btn {
                    margin-bottom: 16px;
                    background: none;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 6px 14px;
                    cursor: pointer;
                    color: #64748b;
                    font-size: 13px;
                    transition: 0.2s;
                }

                .back-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }

                .card-header-flex {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .card-header-flex h3 {
                    margin: 0 0 4px;
                    font-size: 16px;
                    color: #1e293b;
                }

                .card-header-flex .text-sm {
                    margin: 0;
                    font-size: 13px;
                    color: #94a3b8;
                }

                .participant-count {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #64748b;
                    background: #f8fafc;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 6px 12px;
                }

                .participant-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
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
                    font-weight: bold;
                    color: #475569;
                    text-transform: uppercase;
                }

                .status-pill {
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .status-pill.present {
                    background: #ecfdf5;
                    color: #10b981;
                }

                .status-pill.absent {
                    background: #fef2f2;
                    color: #ef4444;
                }

                .attendance-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px;
                    border-radius: 12px;
                    background: rgba(248, 250, 252, 0.9);
                    border: 1px solid var(--border-color);
                }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 10px;
                    border-radius: 10px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: 0.2s;
                }

                .toggle-btn:hover {
                    transform: translateY(-1px);
                }

                .toggle-btn.present.active {
                    background: #ecfdf5;
                    color: #10b981;
                }

                .toggle-btn.absent.active {
                    background: #fef2f2;
                    color: #ef4444;
                }

                .toggle-btn.present:hover { color: #10b981; }
                .toggle-btn.absent:hover { color: #ef4444; }

                .export-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                    background: white;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .export-btn:hover {
                    background: #f8fafc;
                    border-color: var(--primary);
                    color: var(--primary);
                    transform: translateY(-2px);
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #94a3b8;
                }

                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .attendance-table th {
                    padding: 10px 16px;
                    background: #f8fafc;
                    color: #64748b;
                    font-weight: 500;
                    border-bottom: 1px solid var(--border-color);
                    font-size: 13px;
                }

                .attendance-table td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #1e293b;
                }

                .attendance-table tbody tr:hover {
                    background: #fafbfc;
                }

                .text-center { text-align: center; }
                .text-right { text-align: right; }
            `}</style>
        </div>
    );
}