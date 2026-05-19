import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete, Put } from "../api/api"
import { Edit2, Trash2, User, Mail, Phone } from "lucide-react";

export default function AjouterAnimateur({ user, onLogout }) {
    const [animators, setAnimators] = useState([]);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnimators();
    }, []);

    const fetchAnimators = async () => {
        setLoading(true);
        try {
            const res = await Get('animators');
            setAnimators(res.data.animators || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching animators:", err);
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

        if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || (!editingId && !formData.password)) {
            setError("Tous les champs sont requis.");
            return;
        }

        try {
            if (editingId) {
                await Put(`animators/${editingId}`, formData);
            } else {
                await Post('animators', formData);
            }
            setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" });
            setEditingId(null);
            fetchAnimators();
        } catch (err) {
            console.error("Error saving animator:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(" ");
                setError(errorMessages);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Échec de l'enregistrement du formateur. Veuillez vérifier vos données.");
            }
        }
    };

    const handleEdit = (a) => {
        setEditingId(a.id);
        setFormData({
            nom: a.nom,
            prenom: a.prenom,
            email: a.email,
            telephone: a.telephone,
            password: ""
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce formateur ?")) {
            try {
                await Delete(`animators/${id}`);
                fetchAnimators();
            } catch (err) {
                console.error("Error deleting animator:", err);
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
                        <p>Chargement des formateurs...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">Gestion des Formateurs</h1>
                                <p className="page-subtitle">Ajoutez et gérez les formateurs de l'établissement.</p>
                            </div>
                        </header>

                        <div className="content-grid">
                            <div className="form-card modest-card">
                                <h3 className="section-title">
                                    {editingId ? "Modifier le Formateur" : "Ajouter un Nouveau Formateur"}
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
                                                placeholder="Jean"
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
                                                placeholder="Dupont"
                                                className="modest-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label><Mail size={14} style={{ marginRight: '6px' }} /> Adresse Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="jean.dupont@example.com"
                                                className="modest-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Phone size={14} style={{ marginRight: '6px' }} /> Téléphone</label>
                                            <input
                                                type="text"
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                placeholder="+33 6 12 34 56 78"
                                                className="modest-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label><User size={14} style={{ marginRight: '6px' }} /> Mot de passe {editingId && "(Laisser vide pour ne pas modifier)"}</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="modest-input"
                                        />
                                    </div>

                                    {error && <div className="error-box">{error}</div>}

                                    <div className="form-actions">
                                        {editingId && (
                                            <button
                                                type="button"
                                                className="secondary-btn"
                                                onClick={() => { setEditingId(null); setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" }); }}
                                            >
                                                Annuler
                                            </button>
                                        )}
                                        <button type="submit" className="primary-btn">
                                            {editingId ? "Mettre à jour le Formateur" : "Ajouter le Formateur"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="table-card modest-card">
                                <h3 className="section-title">Formateurs Enregistrés</h3>
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Email</th>
                                                <th>Téléphone</th>
                                                <th className="text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {animators.length > 0 ? animators.map((a) => (
                                                <tr key={a.id}>
                                                    <td className="fw-semibold">{a.prenom} {a.nom}</td>
                                                    <td className="text-muted">{a.email}</td>
                                                    <td>{a.telephone}</td>
                                                    <td className="text-right">
                                                        <div className="action-group">
                                                             <button className="icon-btn edit" onClick={() => handleEdit(a)} title="Modifier">
                                                                 <IconEdit />
                                                             </button>
                                                             <button className="icon-btn delete" onClick={() => handleDelete(a.id)} title="Supprimer">
                                                                 <IconTrash />
                                                             </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="empty-row">Aucun formateur inscrit pour le moment.</td>
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
