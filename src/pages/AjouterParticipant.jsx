import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete, Put } from "../api/api"
import { Edit2, Trash2, User, Mail } from "lucide-react";

export default function AjouterParticipant({ user, onLogout }) {
    const [participants, setParticipants] = useState([]);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const res = await Get('participents');
            setParticipants(res.data.participents || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching participants:", err);
        } finally {
            setLoading(false);
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

        if (!formData.nom || !formData.prenom || !formData.email) {
            setError("Tous les champs sont requis.");
            return;
        }

        try {
            if (editingId) {
                await Put(`participents/${editingId}`, formData);
            } else {
                await Post('participents', formData);
            }
            setFormData({ nom: "", prenom: "", email: "" });
            setEditingId(null);
            fetchParticipants();
        } catch (err) {
            console.error("Error saving participant:", err);
            setError("Échec de l'enregistrement du participant. Veuillez vérifier vos données.");
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            nom: p.nom,
            prenom: p.prenom,
            email: p.email
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce participant ?")) {
            try {
                await Delete(`participents/${id}`);
                fetchParticipants();
            } catch (err) {
                console.error("Error deleting participant:", err);
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
                        <p>Chargement des participants...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">Gestion des Participants</h1>
                                <p className="page-subtitle">Inscrivez et gérez les participants aux formations.</p>
                            </div>
                        </header>

                        <div className="content-grid">
                            <div className="form-card modest-card">
                                <h3 className="section-title">
                                    {editingId ? "Modifier le Participant" : "Ajouter un Nouveau Participant"}
                                </h3>

                                <form onSubmit={handleSubmit} className="modest-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><User size={14} style={{ marginRight: '6px' }} /> Prénom</label>
                                            <input
                                                type="text"
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                placeholder="John"
                                                className="modest-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><User size={14} style={{ marginRight: '6px' }} /> Nom</label>
                                            <input
                                                type="text"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                className="modest-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label><Mail size={14} style={{ marginRight: '6px' }} /> Adresse Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john.doe@example.com"
                                            className="modest-input"
                                        />
                                    </div>

                                    {error && <div className="error-box">{error}</div>}

                                    <div className="form-actions">
                                        {editingId && (
                                            <button
                                                type="button"
                                                className="secondary-btn"
                                                onClick={() => { setEditingId(null); setFormData({ nom: "", prenom: "", email: "" }); }}
                                            >
                                                Annuler
                                            </button>
                                        )}
                                        <button type="submit" className="primary-btn">
                                            {editingId ? "Mettre à jour le Participant" : "Ajouter le Participant"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="table-card modest-card">
                                <h3 className="section-title">Participants Inscrits</h3>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Email</th>
                                                <th className="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participants.length > 0 ? participants.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="fw-semibold">{p.prenom} {p.nom}</td>
                                                    <td className="text-muted">{p.email}</td>
                                                    <td className="text-right">
                                                        <div className="action-group">
                                                             <button className="icon-btn edit" onClick={() => handleEdit(p)} title="Modifier">
                                                                 <IconEdit />
                                                             </button>
                                                             <button className="icon-btn delete" onClick={() => handleDelete(p.id)} title="Supprimer">
                                                                 <IconTrash />
                                                             </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="empty-row">Aucun participant inscrit pour le moment.</td>
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
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-main);
                    text-transform: uppercase;
                }
                .form-group input {
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 0.9375rem;
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
                    margin-top: 8px;
                }
                .primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                }
                .secondary-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                    padding: 12px 24px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
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
                .icon-btn.edit:hover { color: #5f6571ff; border-color: #5f6571ff; }
                .icon-btn.delete:hover { background: #f8c9c9ff; color: #e33636ff; border-color: #e33636ff; }
                .icon-btn.add:hover { background: #e3ebf3ff; color: #606873ff; border-color: #465366ff; }
                
                svg { 
                    display: inline-block;
                    vertical-align: middle;
                    stroke: #64748b;
                    stroke-width: 2px;
                }
                .icon-btn.edit:hover svg { stroke: #5f6571; }
                .icon-btn.delete:hover svg { stroke: #ef4444; }
            `}</style>
        </div>
    );
}

const IconEdit = () => <Edit2 size={16} stroke="#64748b" />;
const IconTrash = () => <Trash2 size={16} stroke="#64748b" />;

