import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete, Put } from "../api/api"

// ✅ FIX: import icons
import { User, Hotel, Calendar, DollarSign, Edit2, Trash2, PlusCircle } from "lucide-react"

export default function Hebergement({ user, onLogout }) {
    const [hebergements, setHebergements] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [formData, setFormData] = useState({
        participent_id: "",
        lieu: "",
        date_debut: "",
        date_fin: "",
        prix: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'admin' || !user?.role;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.allSettled([
                fetchHebergements(),
                isAdmin ? fetchParticipants() : Promise.resolve()
            ]);
            setLoading(false);
        };
        load();
    }, [user]);

    const fetchHebergements = async () => {
        try {
            const res = await Get('hebergements');
            const allData = res.data?.hebergements || res.data?.data || res.data || [];

            if (!isAdmin) {
                const myData = allData.filter(h => {
                    const p = h.participant || h.participent;
                    return p?.id === user?.id;
                });
                setHebergements(myData);
            } else {
                setHebergements(Array.isArray(allData) ? allData : []);
            }
        } catch (err) {
            console.error("Error fetching hebergements:", err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await Get('participents');

            // ✅ FIX: always force array
            const data = res.data?.participents || res.data?.data || res.data || [];
            setParticipants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching participants:", err);
            setParticipants([]);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.participent_id || !formData.lieu || !formData.date_debut || !formData.date_fin) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            if (editingId) {
                await Put(`hebergements/${editingId}`, formData);
            } else {
                await Post('hebergements', formData);
            }

            setFormData({
                participent_id: "",
                lieu: "",
                date_debut: "",
                date_fin: "",
                prix: ""
            });

            setEditingId(null);
            fetchHebergements();

        } catch (err) {
            console.error("Error saving hebergement:", err);
            const serverError = err.response?.data?.message || "";
            setError(`Error: ${serverError}`);
        }
    };

    const handleEdit = (h) => {
        setEditingId(h.id);
        setFormData({
            participent_id: h.participent_id,
            lieu: h.lieu,
            date_debut: h.date_debut,
            date_fin: h.date_fin,
            prix: h.prix || ""
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet élément ?")) {
            try {
                await Delete(`hebergements/${id}`);
                fetchHebergements();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Header onLogout={onLogout} username={user?.username} />
            <Aside user={user} />

            <main className="main">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Chargement des enregistrements...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">
                                    {isAdmin ? 'Hébergements' : 'Détails de mon Hébergement'}
                                </h1>
                                <p className="page-subtitle">
                                    {isAdmin 
                                        ? 'Gérez les détails d\'hébergement pour les participants.' 
                                        : 'Consultez les détails de votre hébergement et de votre séjour actuels.'}
                                </p>
                            </div>
                        </header>

                        <div className="content-grid">
                            {isAdmin && (
                                <div className="form-card modest-card">
                                    <h3 className="section-title">
                                        {editingId ? "Modifier l'Hébergement" : "Nouvel Hébergement"}
                                    </h3>
                                    
                                    <form onSubmit={handleSubmit} className="modest-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label><User size={14} style={{marginRight: '6px'}} /> Participant</label>
                                                <select
                                                    name="participent_id"
                                                    value={formData.participent_id}
                                                    onChange={handleChange}
                                                    className="modest-input"
                                                >
                                                    <option value="">Sélectionnez un participant</option>
                                                    {Array.isArray(participants) && participants.map(p => (
                                                        <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label><Hotel size={14} style={{marginRight: '6px'}} /> Lieu / Hôtel</label>
                                                <input
                                                    type="text"
                                                    name="lieu"
                                                    value={formData.lieu}
                                                    onChange={handleChange}
                                                    placeholder="Entrez le nom de l'hôtel"
                                                    className="modest-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label><Calendar size={14} style={{marginRight: '6px'}} /> Date de Début</label>
                                                <input
                                                    type="date"
                                                    name="date_debut"
                                                    value={formData.date_debut}
                                                    onChange={handleChange}
                                                    className="modest-input"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label><Calendar size={14} style={{marginRight: '6px'}} /> Date de Fin</label>
                                                <input
                                                    type="date"
                                                    name="date_fin"
                                                    value={formData.date_fin}
                                                    onChange={handleChange}
                                                    className="modest-input"
                                                />
                                            </div>
                                             <div className="form-group">
                                                <label><DollarSign size={14} style={{marginRight: '6px'}} /> Prix (DH)</label>
                                                <input
                                                    type="number"
                                                    name="prix"
                                                    value={formData.prix}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    className="modest-input"
                                                />
                                            </div>
                                        </div>

                                        {error && <div className="error-box">{error}</div>}

                                        <div className="form-actions">
                                            {editingId && (
                                                <button 
                                                    type="button" 
                                                    className="secondary-btn" 
                                                    onClick={() => { setEditingId(null); setFormData({ participent_id: "", lieu: "", date_debut: "", date_fin: "", prix: "" }); }}
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            <button type="submit" className="primary-btn">
                                                {editingId ? "Mettre à jour l'entrée" : "Enregistrer l'entrée"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className={`table-card modest-card ${isAdmin ? 'mt-4' : ''}`}>
                                <h3 className="section-title">
                                    {isAdmin ? 'Enregistrements Actuels' : 'Informations sur l\'Hébergement'}
                                </h3>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Participant</th>
                                                <th>Lieu</th>
                                                <th>Période</th>
                                                <th>Prix</th>
                                                {isAdmin && <th className="text-right">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hebergements.length > 0 ? hebergements.map((h) => {
                                                const p = h.participant || h.participent;
                                                return (
                                                    <tr key={h.id}>
                                                        <td className="fw-semibold">
                                                            {p ? `${p.prenom || ''} ${p.nom || ''}` : 'Inconnu'}
                                                        </td>
                                                        <td>{h.lieu}</td>
                                                        <td className="text-muted">{h.date_debut} - {h.date_fin}</td>
                                                        <td className="fw-medium">{h.prix ? `${h.prix} DH` : '-'}</td>
                                                        {isAdmin && (
                                                            <td className="text-right">
                                                                <div className="action-group">
                                                                        <button className="icon-btn edit" onClick={() => handleEdit(h)} title="Modifier">
                                                                            <IconEdit />
                                                                        </button>
                                                                        <button className="icon-btn delete" onClick={() => handleDelete(h.id)} title="Supprimer">
                                                                            <IconTrash />
                                                                        </button>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            }) : (
                                                <tr>
                                                    <td colSpan={isAdmin ? "5" : "4"} className="empty-row">Aucun enregistrement trouvé.</td>
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
                .content-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .modest-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 32px;
                    box-shadow: var(--shadow-sm);
                }
                .section-title {
                    font-size: 1.125rem;
                    margin-bottom: 24px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                }
                .modest-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    display: flex;
                    align-items: center;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-main);
                    text-transform: uppercase;
                }
                .modest-input {
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 0.9375rem;
                    width: 100%;
                }
                .error-box {
                    background: #fef2f2;
                    color: #ef4444;
                    padding: 12px;
                    border-radius: var(--radius-sm);
                    font-size: 0.875rem;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                .primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    cursor: pointer;
                }
                .secondary-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                    padding: 12px 24px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .table-wrapper {
                    overflow-x: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    text-align: left;
                    padding: 12px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    border-bottom: 1px solid var(--border-color);
                    background: #f8fafc;
                }
                td {
                    padding: 16px 12px;
                    font-size: 0.9375rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .text-right { text-align: right; }
                .fw-semibold { font-weight: 600; }
                .fw-medium { font-weight: 500; }
                .empty-row { text-align: center; color: var(--text-muted); padding: 40px; }
                
                .action-group {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .icon-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-muted);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn.edit:hover {color: #5f6571ff; border-color: #5f6571ff; }
                .icon-btn.delete:hover { background: #f8c9c9ff; color: #e33636ff; border-color: #e33636ff; }
                
                svg { 
                    display: inline-block;
                    vertical-align: middle;
                    stroke: #64748b;
                    stroke-width: 2px;
                }
                .icon-btn.edit:hover svg { stroke: #5f6571; }
                .icon-btn.delete:hover svg { stroke: #ef4444; }
                
                .form-group label svg {
                    color: var(--primary);
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
}

const IconEdit = () => <Edit2 size={16} stroke="#64748b" />;
const IconTrash = () => <Trash2 size={16} stroke="#64748b" />;