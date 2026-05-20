import { useState, useEffect, useMemo } from "react";
import Formations from "./formations";
import Aside from "../components/aside";
import Header from "../components/header";
import "../styles/dashboard.css";

import {
    Get,
    Post,
    Put,
    Delete,
} from "../api/api";

import {
    Book,
    FileText,
    Calendar,
    Clock,
    Plus,
    X,
    AlertCircle,
    Search,
    GraduationCap,
    CheckCircle2,
    TimerReset,
} from "lucide-react";

export default function ListeFormation({
    user,
    onLogout,
}) {
    const [showForm, setShowForm] =
        useState(false);

    const [editingIndex, setEditingIndex] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [data, setData] = useState([]);

    const [saving, setSaving] =
        useState(false);

    const [newFormation, setNewFormation] =
        useState({
            title: "",
            description: "",
            duree: "",
            date_debut: "",
            date_fin: "",
        });

    // useEffect(() => {
    //     fetchFormations();
    // }, []);

    // const normalizeData = (data, key) => {
    //     return data?.[key] || data?.data || data || [];
    // };

    //     const fetchFormations = async () => {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         const [formationsRes, pivotsRes] = await Promise.all([
    //             Get("formations"),
    //             Get("pivot"),
    //         ]);

    //         const allFormations =
    //             formationsRes?.data?.formations ||
    //             formationsRes?.data?.data ||
    //             formationsRes?.data ||
    //             [];

    //         const allPivots =
    //             pivotsRes?.data?.pivots ||
    //             pivotsRes?.data?.data ||
    //             pivotsRes?.data ||
    //             [];

    //         let filtered = allFormations;

    //         // =========================
    //         // ✅ IMPORTANT FIX HERE
    //         // =========================
    //         if (user?.role === "animateur") {
    //             const trainerId =
    //                 user?.animater?.id || user?.id;

    //             const myFormationIds = allPivots
    //                 .filter(
    //                     (p) =>
    //                         Number(p.animater_id) ===
    //                         Number(trainerId)
    //                 )
    //                 .map((p) => p.formation_id);

    //             filtered = allFormations.filter((f) =>
    //                 myFormationIds.includes(f.id)
    //             );
    //         }

    //         setData(filtered);
    //     } catch (err) {
    //         console.error(err);
    //         setError("Erreur lors du chargement des formations.");
    //         setData([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                setLoading(true);
                setError(null);

                const [formationsRes, pivotsRes] = await Promise.all([
                    Get("formations"),
                    Get("pivot"),
                ]);

                const allFormations =
                    formationsRes?.data?.formations ||
                    formationsRes?.data?.data ||
                    formationsRes?.data ||
                    [];

                const allPivots =
                    pivotsRes?.data?.pivots ||
                    pivotsRes?.data?.data ||
                    pivotsRes?.data ||
                    [];

                let filtered = allFormations;

                // 🔥 ONLY FILTER FOR ANIMATEUR
                const trainerId =
                    user?.animater?.id || user?.id;

                const myFormationIds = allPivots
                    .filter(p =>
                        Number(p.animater_id) === Number(trainerId)
                    )
                    .map(p => p.formation_id);

                if (myFormationIds.length > 0) {
                    filtered = allFormations.filter(f =>
                        myFormationIds.includes(f.id)
                    );
                }

                setData(filtered);

            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des formations.");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, [user]);
    const handleChange = (e) => {
        setNewFormation({
            ...newFormation,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);

        setNewFormation({
            ...data[index],
        });

        setShowForm(true);
    };

    const validateForm = () => {
        if (
            !newFormation.title.trim() ||
            !newFormation.description.trim() ||
            !newFormation.duree ||
            !newFormation.date_debut ||
            !newFormation.date_fin
        ) {
            alert(
                "Tous les champs sont obligatoires."
            );

            return false;
        }

        if (
            new Date(
                newFormation.date_fin
            ) <
            new Date(
                newFormation.date_debut
            )
        ) {
            alert(
                "La date de fin doit être après la date de début."
            );

            return false;
        }

        return true;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);

            if (
                editingIndex !== null
            ) {
                const formationId =
                    data[
                        editingIndex
                    ]?.id;

                const res =
                    await Put(
                        `formations/${formationId}`,
                        newFormation
                    );

                const updated =
                    res.data?.data ||
                    res.data ||
                    newFormation;

                const updatedData =
                    [...data];

                updatedData[
                    editingIndex
                ] = updated;

                setData(
                    updatedData
                );
            } else {
                const res =
                    await Post(
                        "formations",
                        newFormation
                    );

                const added =
                    res.data?.data ||
                    res.data ||
                    newFormation;

                setData((prev) => [
                    ...prev,
                    added,
                ]);
            }

            resetForm();
        } catch (err) {
            console.error(err);

            alert(
                "Erreur lors de l'enregistrement."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        index
    ) => {
        const formationId =
            data[index]?.id;

        if (
            !window.confirm(
                "Supprimer cette formation ?"
            )
        )
            return;

        try {
            if (formationId) {
                await Delete(
                    `formations/${formationId}`
                );
            }

            setData((prev) =>
                prev.filter(
                    (_, i) =>
                        i !== index
                )
            );
        } catch (err) {
            console.error(err);

            alert(
                "Erreur lors de la suppression."
            );
        }
    };

    const resetForm = () => {
        setShowForm(false);

        setEditingIndex(null);

        setNewFormation({
            title: "",
            description: "",
            duree: "",
            date_debut: "",
            date_fin: "",
        });
    };

    const filteredFormations =
        useMemo(() => {
            return data.filter(
                (f) =>
                    f.title
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    f.description
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );
        }, [data, search]);

    const stats = useMemo(() => {
        const today = new Date();

        let active = 0;
        let upcoming = 0;
        let completed = 0;

        data.forEach((f) => {
            const start =
                new Date(
                    f.date_debut
                );

            const end =
                new Date(
                    f.date_fin
                );

            if (
                today >= start &&
                today <= end
            ) {
                active++;
            } else if (
                today < start
            ) {
                upcoming++;
            } else {
                completed++;
            }
        });

        return {
            total: data.length,
            active,
            upcoming,
            completed,
        };
    }, [data]);

    return (
        <div className="dashboard-layout">
            <Header
                onLogout={onLogout}
                user={user}
            />

            <Aside user={user} />

            <main className="main">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>

                        <p>
                            Chargement des
                            formations...
                        </p>
                    </div>
                ) : (
                    <>
                        <header className="page-header">
                            <div>
                                <h1 className="page-title">
                                    Gérer les
                                    Formations
                                </h1>

                                <p className="page-subtitle">
                                    Ajoutez,
                                    modifiez
                                    et gérez
                                    les
                                    programmes
                                    de
                                    formation.
                                </p>
                            </div>

                            {user?.role == "animateur" || user?.role == "client" && (
                                <button
                                    className="add-btn-primary"
                                    onClick={() => {
                                        setShowForm(true);
                                        setEditingIndex(null);
                                    }}
                                >
                                    <Plus size={18} />
                                    Créer une Formation
                                </button>
                            )}
                        </header>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <GraduationCap
                                        size={
                                            22
                                        }
                                    />
                                </div>

                                <div>
                                    <span className="stat-label">
                                        Total
                                    </span>

                                    <h3 className="stat-value">
                                        {
                                            stats.total
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <CheckCircle2
                                        size={
                                            22
                                        }
                                    />
                                </div>

                                <div>
                                    <span className="stat-label">
                                        Actives
                                    </span>

                                    <h3 className="stat-value">
                                        {
                                            stats.active
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon yellow">
                                    <Calendar
                                        size={
                                            22
                                        }
                                    />
                                </div>

                                <div>
                                    <span className="stat-label">
                                        À Venir
                                    </span>

                                    <h3 className="stat-value">
                                        {
                                            stats.upcoming
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon red">
                                    <TimerReset
                                        size={
                                            22
                                        }
                                    />
                                </div>

                                <div>
                                    <span className="stat-label">
                                        Terminées
                                    </span>

                                    <h3 className="stat-value">
                                        {
                                            stats.completed
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="toolbar">
                            <div className="search-box">
                                <Search
                                    size={
                                        18
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Rechercher une formation..."
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-box">
                                <AlertCircle
                                    size={
                                        18
                                    }
                                />

                                {error}
                            </div>
                        )}

                        <div className="row">
                            {filteredFormations.length >
                                0 ? (
                                filteredFormations.map(
                                    (
                                        formation,
                                        index
                                    ) => (
                                        <Formations
                                            key={
                                                formation.id ||
                                                index
                                            }
                                            formation={
                                                formation
                                            }
                                            Supp={() =>
                                                handleDelete(
                                                    index
                                                )
                                            }
                                            Edit={() =>
                                                handleEdit(
                                                    index
                                                )
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <div className="empty-state">
                                    <Book
                                        size={
                                            48
                                        }
                                    />

                                    <h3>
                                        Aucune
                                        Formation
                                    </h3>

                                    <p>
                                        Aucun
                                        programme
                                        trouvé
                                        pour le
                                        moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {showForm && (
                    <div
                        className="modal-overlay"
                        onClick={
                            resetForm
                        }
                    >
                        <div
                            className="modal-card"
                            onClick={(
                                e
                            ) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="modal-header">
                                <div>
                                    <h2>
                                        {editingIndex !==
                                            null
                                            ? "Modifier la Formation"
                                            : "Nouvelle Formation"}
                                    </h2>

                                    <p>
                                        Remplissez
                                        les
                                        détails
                                        du
                                        programme.
                                    </p>
                                </div>

                                <button
                                    className="close-modal"
                                    onClick={
                                        resetForm
                                    }
                                >
                                    <X
                                        size={
                                            20
                                        }
                                    />
                                </button>
                            </div>

                            <div className="modal-form">
                                <div className="form-group">
                                    <label>
                                        <Book
                                            size={
                                                14
                                            }
                                        />
                                        Titre
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Développement Web..."
                                        value={
                                            newFormation.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="modest-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FileText
                                            size={
                                                14
                                            }
                                        />
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="4"
                                        placeholder="Description de la formation..."
                                        value={
                                            newFormation.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="modest-input"
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            <Clock
                                                size={
                                                    14
                                                }
                                            />
                                            Durée
                                        </label>

                                        <input
                                            type="number"
                                            name="duree"
                                            placeholder="3"
                                            value={
                                                newFormation.duree
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="modest-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Calendar
                                                size={
                                                    14
                                                }
                                            />
                                            Début
                                        </label>

                                        <input
                                            type="date"
                                            name="date_debut"
                                            value={
                                                newFormation.date_debut
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="modest-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Calendar
                                                size={
                                                    14
                                                }
                                            />
                                            Fin
                                        </label>

                                        <input
                                            type="date"
                                            name="date_fin"
                                            value={
                                                newFormation.date_fin
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="modest-input"
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="secondary-btn"
                                        onClick={
                                            resetForm
                                        }
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        className="primary-btn"
                                        onClick={
                                            handleAdd
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Enregistrement..."
                                            : editingIndex !==
                                                null
                                                ? "Mettre à jour"
                                                : "Créer"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx="true">{`
                .loading-state {
                    min-height: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                }

                .spinner {
                    width: 42px;
                    height: 42px;
                    border: 3px solid
                        #e2e8f0;
                    border-top-color: var(
                        --primary
                    );
                    border-radius: 50%;
                    animation: spin 0.7s
                        linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(
                            360deg
                        );
                    }
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 6px;
                }

                .page-subtitle {
                    color: var(
                        --text-muted
                    );
                }

                .add-btn-primary {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    background: var(
                        --primary
                    );

                    color: white;

                    border: none;

                    padding: 12px 22px;

                    border-radius: 12px;

                    font-weight: 700;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .add-btn-primary:hover {
                    transform: translateY(
                        -2px
                    );

                    box-shadow: 0 8px 20px
                        rgba(
                            99,
                            102,
                            241,
                            0.2
                        );
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fit,
                        minmax(220px, 1fr)
                    );

                    gap: 20px;

                    margin-bottom: 28px;
                }

                .stat-card {
                    background: white;

                    border: 1px solid
                        var(
                            --border-color
                        );

                    border-radius: 18px;

                    padding: 22px;

                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .stat-icon {
                    width: 52px;
                    height: 52px;

                    border-radius: 14px;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .blue {
                    background: #eef2ff;
                    color: #4f46e5;
                }

                .green {
                    background: #ecfdf5;
                    color: #10b981;
                }

                .yellow {
                    background: #fef9c3;
                    color: #ca8a04;
                }

                .red {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .stat-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(
                        --text-muted
                    );
                    font-weight: 700;
                }

                .stat-value {
                    font-size: 1.6rem;
                    font-weight: 800;
                }

                .toolbar {
                    display: flex;
                    justify-content: space-between;

                    margin-bottom: 28px;
                }

                .search-box {
                    width: 100%;
                    max-width: 420px;

                    background: white;

                    border: 1px solid
                        var(
                            --border-color
                        );

                    border-radius: 14px;

                    padding: 12px 16px;

                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .search-box input {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                }

                .row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .empty-state {
                    width: 100%;

                    background: white;

                    border: 2px dashed
                        var(
                            --border-color
                        );

                    border-radius: 22px;

                    padding: 80px 20px;

                    text-align: center;

                    color: var(
                        --text-muted
                    );

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;

                    background: rgba(
                        15,
                        23,
                        42,
                        0.5
                    );

                    backdrop-filter: blur(
                        4px
                    );

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    z-index: 1000;
                }

                .modal-card {
                    background: white;

                    width: 100%;
                    max-width: 700px;

                    border-radius: 24px;

                    overflow: hidden;

                    box-shadow: 0 20px 40px
                        rgba(0, 0, 0, 0.1);
                }

                .modal-header {
                    padding: 26px 32px;

                    border-bottom: 1px solid
                        #e2e8f0;

                    background: #f8fafc;

                    display: flex;
                    justify-content: space-between;
                }

                .modal-header h2 {
                    margin-bottom: 4px;
                    font-size: 1.4rem;
                }

                .modal-header p {
                    color: var(
                        --text-muted
                    );
                    font-size: 0.9rem;
                }

                .close-modal {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #64748b;
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
                    gap: 10px;
                }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 6px;

                    font-size: 0.8rem;

                    text-transform: uppercase;

                    font-weight: 700;
                }

                .modest-input {
                    border: 1px solid
                        var(
                            --border-color
                        );

                    border-radius: 12px;

                    padding: 14px;

                    font-size: 0.95rem;

                    transition: 0.2s;
                }

                .modest-input:focus {
                    outline: none;
                    border-color: var(
                        --primary
                    );
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        3,
                        1fr
                    );

                    gap: 16px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .primary-btn,
                .secondary-btn {
                    padding: 12px 22px;

                    border-radius: 12px;

                    font-weight: 700;

                    cursor: pointer;
                }

                .primary-btn {
                    background: var(
                        --primary
                    );

                    color: white;

                    border: none;
                }

                .secondary-btn {
                    background: white;

                    border: 1px solid
                        var(
                            --border-color
                        );
                }

                .error-box {
                    background: #fee2e2;
                    color: #dc2626;

                    padding: 14px 18px;

                    border-radius: 12px;

                    display: flex;
                    align-items: center;
                    gap: 8px;

                    margin-bottom: 20px;

                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .modal-card {
                        margin: 20px;
                    }
                }
            `}</style>
        </div>
    );
}