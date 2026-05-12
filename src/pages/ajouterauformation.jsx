import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Get, Put, Post, Delete } from "../api/api"
import { Users, Layers, BookOpen, Trash2, CheckCircle, Info } from "lucide-react";

export default function AjouterAuFormation({ user, onLogout }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selections, setSelections] = useState({
        animateurs: [],
        themes: []
    });

    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [selectedPivotIds, setSelectedPivotIds] = useState([]);
    const [data, setData] = useState([]);
    const [themes, setThemes] = useState([]);
    const [animateurs, setAnimateurs] = useState([]);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const [formRes, themeRes, animRes] = await Promise.all([
                    Get('formations'),
                    Get('themes'),
                    Get('animateurs')
                ]);
                
                setData(formRes.data.formations || formRes.data.data || formRes.data || []);
                setThemes(themeRes.data.themes || themeRes.data.data || (Array.isArray(themeRes.data) ? themeRes.data : []));
                setAnimateurs(animRes.data.animators || animRes.data.animateurs || animRes.data.data || (Array.isArray(animRes.data) ? animRes.data : []));
            } catch (err) {
                console.error("Error loading initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const fetchFormations = async () => {
        try {
            const res = await Get('formations');
            setData(res.data.formations || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error refreshing formations:", err);
        }
    };

    const handleSelectChange = (e) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setSelections({
            ...selections,
            [name]: selectedValues
        });
    };

    const toggleCheckbox = (index) => {
        if (selectedIndexes.includes(index)) {
            setSelectedIndexes(selectedIndexes.filter(i => i !== index));
        } else {
            setSelectedIndexes([...selectedIndexes, index]);
        }
    };

    const togglePivotCheckbox = (id) => {
        if (selectedPivotIds.includes(id)) {
            setSelectedPivotIds(selectedPivotIds.filter(i => i !== id));
        } else {
            setSelectedPivotIds([...selectedPivotIds, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        if (selectedIndexes.length === 0) {
            setError("Veuillez sélectionner au moins une formation.");
            return;
        }
        
        if (selections.themes.length === 0 || selections.animateurs.length === 0) {
            setError("Veuillez sélectionner au moins un thème et un animateur.");
            return;
        }

        try {
            const promises = [];
            selectedIndexes.forEach((index) => {
                const originalRow = data[index];
                selections.themes.forEach((themeId) => {
                    selections.animateurs.forEach((animateurId) => {
                        const updatedRow = {
                            formation_id: originalRow.id,
                            theme_id: themeId,
                            animater_id: animateurId
                        };
                        promises.push(Post(`pivot`, updatedRow));
                    });
                });
            });

            await Promise.all(promises);
            await fetchFormations();
            setSelectedIndexes([]);
            setSelectedPivotIds([]);
            alert("Affecté avec succès !");
        } catch (err) {
            console.error("Error updating formations:", err);
            setError("Une erreur est survenue lors de l'affectation.");
        }
    };

    const desaffecter = async () => {
        if (selectedPivotIds.length === 0 && (selections.themes.length === 0 || selections.animateurs.length === 0)) {
            setError("Veuillez sélectionner les formations à désaffecter ou choisir un thème et un animateur.");
            return;
        }

        try {
            let rowsToDesaffecter = [];
            if (selectedPivotIds.length > 0) {
                rowsToDesaffecter = data.filter(row => selectedPivotIds.includes(row.id));
            } else {
                rowsToDesaffecter = data.filter(row => {
                    const currentThemeId = row.themes?.[0]?.id;
                    const currentAnimaterId = row.animateurs?.[0]?.id;
                    return selections.themes.includes(String(currentThemeId)) && selections.animateurs.includes(String(currentAnimaterId));
                });
            }

            if (rowsToDesaffecter.length === 0) {
                setError("Aucune formation ne correspond à cette sélection.");
                return;
            }

            const promises = [];
            rowsToDesaffecter.forEach((row) => {
                const themesToProcess = selections.themes.length > 0 ? selections.themes : (row.themes?.map(t => String(t.id)) || []);
                const animateursToProcess = selections.animateurs.length > 0 ? selections.animateurs : (row.animateurs?.map(a => String(a.id)) || []);
                themesToProcess.forEach((themeId) => {
                    animateursToProcess.forEach((animateurId) => {
                        promises.push(Delete(`pivot`, { formation_id: row.id, theme_id: themeId, animater_id: animateurId }));
                    });
                });
            });

            await Promise.all(promises);
            await fetchFormations();
            setSelectedPivotIds([]);
            alert("Désaffecté avec succès !");
        } catch (err) {
            console.error("Error desaffecting formations:", err);
            setError("Une erreur est survenue lors de la désaffectation.");
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
                        <p>Préparation de l'espace d'affectation...</p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">Affecter les Détails de Formation</h1>
                                <p className="page-subtitle">Associez les thèmes et les animateurs aux programmes spécifiques.</p>
                            </div>
                        </header>

                        <div className="assignment-container modest-card">
                            <form onSubmit={handleSubmit} className="assignment-form">
                                <div className="selection-grid">
                                    <div className="form-group">
                                        <label><Layers size={14} style={{ marginRight: '6px' }} /> Thèmes</label>
                                        <select
                                            multiple
                                            name="themes"
                                            value={selections.themes}
                                            onChange={handleSelectChange}
                                            className="modest-select"
                                        >
                                            {themes.map((c, index) => (
                                                <option key={index} value={c?.id}>
                                                    {c?.title ? c.title.charAt(0).toUpperCase() + c.title.slice(1) : "Thème Sans Nom"}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="help-text"><Info size={12} style={{marginRight: '4px'}} /> Maintenez Ctrl/Cmd pour une sélection multiple</p>
                                    </div>

                                    <div className="form-group">
                                        <label><Users size={14} style={{ marginRight: '6px' }} /> Animateurs</label>
                                        <select
                                            multiple
                                            name="animateurs"
                                            value={selections.animateurs}
                                            onChange={handleSelectChange}
                                            className="modest-select"
                                        >
                                            {animateurs.map((c, index) => (
                                                <option key={index} value={c?.id}>
                                                    {c?.nom ? c.nom.charAt(0).toUpperCase() + c.nom.slice(1) : "Animateur Sans Nom"}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="help-text"><Info size={12} style={{marginRight: '4px'}} /> Maintenez Ctrl/Cmd pour une sélection multiple</p>
                                    </div>
                                </div>

                                <section className="table-section">
                                    <h3 className="section-title">
                                        <BookOpen size={16} style={{marginRight: '8px'}} /> 1. Sélectionner les Formations
                                    </h3>
                                    <div className="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={{width: '50px'}}>Sélectionner</th>
                                                    <th>Titre du Programme</th>
                                                    <th>Durée</th>
                                                    <th>Dates</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((c, index) => (
                                                    <tr key={`base-${index}`} onClick={() => toggleCheckbox(index)} className={selectedIndexes.includes(index) ? "selected" : ""}>
                                                        <td>
                                                            <div className="custom-checkbox">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={selectedIndexes.includes(index)} 
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="fw-semibold">{c.title}</td>
                                                        <td className="text-muted">{c.duree} Mois</td>
                                                        <td className="text-muted">{c.date_debut} - {c.date_fin}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <section className="table-section">
                                    <h3 className="section-title">
                                        <CheckCircle size={16} style={{marginRight: '8px'}} /> 2. Affectations Actives
                                    </h3>
                                    <div className="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={{width: '50px'}}>Sélectionner</th>
                                                    <th>Programme</th>
                                                    <th>Animateurs Associés</th>
                                                    <th>Thèmes Associés</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.filter(c => c.animateurs?.length > 0 || c.themes?.length > 0).map((c, index) => (
                                                    <tr key={`pivot-${index}`} onClick={() => togglePivotCheckbox(c.id)} className={selectedPivotIds.includes(c.id) ? "selected" : ""}>
                                                        <td>
                                                            <div className="custom-checkbox">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={selectedPivotIds.includes(c.id)} 
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="fw-semibold">{c.title}</td>
                                                        <td>{c.animateurs?.map(a => a.nom).join(', ') || '-'}</td>
                                                        <td>{c.themes?.map(t => t.title).join(', ') || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {error && <div className="error-box">{error}</div>}

                                <div className="form-actions">
                                    <button type="button" className="secondary-btn" onClick={desaffecter}>
                                        <Trash2 size={16} style={{marginRight: '8px'}} /> Désaffecter
                                    </button>
                                    <button type="submit" className="primary-btn">
                                        <CheckCircle size={16} style={{marginRight: '8px'}} /> Confirmer l'Affectation
                                    </button>
                                </div>
                            </form>
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
                .assignment-container {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 32px;
                    box-shadow: var(--shadow-sm);
                }
                .selection-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                    margin-bottom: 40px;
                }
                .modest-select {
                    width: 100%;
                    height: 180px;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 0.9375rem;
                    background: #fdfdfd;
                    transition: border-color 0.2s;
                }
                .modest-select:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .help-text {
                    display: flex;
                    align-items: center;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 8px;
                }
                .table-section {
                    margin-bottom: 48px;
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    font-size: 1.125rem;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                }
                .table-wrapper {
                    max-height: 350px;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: white;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background: #f8fafc;
                    padding: 12px 16px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-align: left;
                    position: sticky;
                    top: 0;
                    border-bottom: 1px solid var(--border-color);
                    z-index: 10;
                }
                td {
                    padding: 14px 16px;
                    font-size: 0.875rem;
                    border-bottom: 1px solid var(--border-color);
                }
                tr:last-child td { border-bottom: none; }
                tr:hover { background: #f8fafc; cursor: pointer; }
                tr.selected { background: #eff6ff; }
                .fw-semibold { font-weight: 600; }
                .text-muted { color: var(--text-muted); }
                
                .custom-checkbox {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .error-box {
                    background: #fef2f2;
                    color: #ef4444;
                    padding: 16px;
                    border-radius: var(--radius-sm);
                    margin-bottom: 24px;
                    font-size: 0.875rem;
                    border: 1px solid #fee2e2;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-color);
                }
                .primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 28px;
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
                .secondary-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                    padding: 12px 28px;
                    border-radius: var(--radius-sm);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .secondary-btn:hover {
                    background: #f1f5f9;
                }
                
                svg { 
                    display: inline-block;
                    vertical-align: middle;
                    stroke: currentColor;
                    stroke-width: 2px;
                }
            `}</style>
        </div>
    )
}