import { useState, useEffect } from "react";
import Formations from "./formations";
import Aside from "../components/aside";
import Header from "../components/header";
import '../styles/dashboard.css';
import { Get, Post, Put, Delete } from "../api/api";
import { Book, FileText, Calendar, Clock, Plus, X } from "lucide-react";

export default function ListeFormation({ user, onLogout }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newFormation, setNewFormation] = useState({
        title: "",
        description: "",
        duree: "",
        date_debut: "",
        date_fin: ""
    });

    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        setLoading(true);
        try {
            const res = await Get('formations');
            const formations = res.data.formations || res.data.data || res.data;
            setData(Array.isArray(formations) ? formations : []);
        } catch (err) {
            console.error("Error fetching formations:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewFormation({
            ...newFormation,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNewFormation({ ...data[index] });
        setShowForm(true);
    };

    const handleAdd = async () => {
        if (!newFormation.title.trim() || !newFormation.duree) {
            alert("Le titre et la durée sont requis");
            return;
        }

        try {
            if (editingIndex !== null) {
                const formationId = data[editingIndex].id;
                const res = await Put(`formations/${formationId}`, newFormation);
                const updatedData = [...data];
                updatedData[editingIndex] = res.data.data || res.data || newFormation;
                setData(updatedData);
                setEditingIndex(null);
            } else {
                const res = await Post('formations', newFormation);
                const added = res.data.data || res.data || newFormation;
                setData([...data, added]);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving formation:", err);
        }
    };

    const resetForm = () => {
        setNewFormation({
            title: "",
            description: "",
            duree: "",
            date_debut: "",
            date_fin: ""
        });
        setShowForm(false);
        setEditingIndex(null);
    };

    const handleDelete = async (index) => {
        const formationId = data[index].id;
        if (!formationId) {
            setData((prev) => prev.filter((_, i) => i !== index));
            return;
        }

        if (window.confirm("Supprimer cette formation ?")) {
            try {
                await Delete(`formations/${formationId}`);
                setData((prev) => prev.filter((_, i) => i !== index));
            } catch (err) {
                console.error("Error deleting formation:", err);
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
                        <p>Chargement des formations...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">Gérer les Formations</h1>
                                <p className="page-subtitle">Ajoutez, modifiez ou supprimez des programmes de formation.</p>
                            </div>
                            <button
                                className="add-btn-primary"
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingIndex(null);
                                }}
                            >
                                <Plus size={18} style={{ marginRight: '8px' }} /> Créer une Formation
                            </button>
                        </header>

                        <div className="row">
                            {data.length > 0 ? data.map((formation, index) => (
                                <Formations
                                    key={formation.id || index}
                                    formation={formation}
                                    Supp={() => handleDelete(index)}
                                    Edit={() => handleEdit(index)}
                                />
                            )) : (
                                <div className="empty-state">
                                    <p>Aucune formation trouvée. Cliquez sur le bouton ci-dessus pour ajouter votre première.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {showForm && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-card modest-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h2>{editingIndex !== null ? "Modifier la Formation" : "Nouvelle Formation"}</h2>
                                    <p>Remplissez les détails du programme de formation.</p>
                                </div>
                                <button className="close-modal" onClick={resetForm}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-form">
                                <div className="form-group">
                                    <label><Book size={14} style={{ marginRight: '6px' }} /> Titre de la Formation</label>
                                    <input
                                        type="text"
                                        placeholder="ex. Développement Web Fullstack"
                                        name="title"
                                        value={newFormation.title}
                                        onChange={handleChange}
                                        className="modest-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label><FileText size={14} style={{ marginRight: '6px' }} /> Description</label>
                                    <textarea
                                        placeholder="Décrivez brièvement ce que couvre cette formation..."
                                        name="description"
                                        value={newFormation.description}
                                        onChange={handleChange}
                                        className="modest-input"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label><Clock size={14} style={{ marginRight: '6px' }} /> Durée (Mois)</label>
                                        <input
                                            type="number"
                                            placeholder="3"
                                            name="duree"
                                            value={newFormation.duree}
                                            onChange={handleChange}
                                            className="modest-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Calendar size={14} style={{ marginRight: '6px' }} /> Date de Début</label>
                                        <input
                                            type="date"
                                            name="date_debut"
                                            value={newFormation.date_debut}
                                            onChange={handleChange}
                                            className="modest-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Calendar size={14} style={{ marginRight: '6px' }} /> Date de Fin</label>
                                        <input
                                            type="date"
                                            name="date_fin"
                                            value={newFormation.date_fin}
                                            onChange={handleChange}
                                            className="modest-input"
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button className="secondary-btn" onClick={resetForm}>
                                        Annuler
                                    </button>
                                    <button className="primary-btn" onClick={handleAdd}>
                                        {editingIndex !== null ? "Mettre à jour" : "Créer la Formation"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }
                .page-title {
                    font-size: 1.75rem;
                    margin-bottom: 4px;
                }
                .page-subtitle {
                    color: var(--text-muted);
                    font-size: 0.9375rem;
                }
                .add-btn-primary {
                    background: var(--primary);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .add-btn-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -12px;
                }
                
                .empty-state {
                    width: 100%;
                    padding: 80px 20px;
                    text-align: center;
                    color: var(--text-muted);
                    background: var(--bg-card);
                    border: 2px dashed var(--border-color);
                    border-radius: var(--radius-md);
                    margin: 0 12px;
                }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modest-modal {
                    background: white;
                    max-width: 650px;
                    width: 100%;
                    border-radius: var(--radius-md);
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                }
                .modal-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid var(--border-color);
                    background: #f8fafc;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .close-modal {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .close-modal:hover {
                    background: #e2e8f0;
                    color: var(--text-main);
                }
                .modal-header h2 {
                    font-size: 1.25rem;
                    margin: 0 0 4px 0;
                }
                .modal-header p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin: 0;
                }
                .modal-form {
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
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
                    letter-spacing: 0.025em;
                }
                .modest-input {
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 0.9375rem;
                    transition: border-color 0.2s;
                }
                .modest-input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 16px;
                }
                .modal-actions {
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
            `}</style>
        </div>
    );
}
