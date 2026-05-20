import React, { useEffect, useMemo, useRef, useState } from "react";
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
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Main({ user, className }) {
    const [formations, setFormations] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedFormationId, setExpandedFormationId] = useState(null);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const tableRef = useRef(null);

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        participants: 0,
        upcoming: 0,
    });

    const role = user?.role?.toLowerCase() || "admin";

    const isAdmin = role === "admin";
    const isTrainer =
        role === "formateur" ||
        role === "trainer" ||
        role === "animateur";

    const isClient =
        role === "client" ||
        role === "participant";

    const normalizeData = (data, key) => {
        return data?.[key] || data?.data || data || [];
    };

    const today = new Date();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    formationsRes,
                    participantsRes,
                    assignmentsRes,
                ] = await Promise.allSettled([
                    Get("formations"),
                    Get("participents"),
                    Get("assignments"),
                ]);

                let fetchedFormations = [];
                let fetchedParticipantsCount = 0;
                let fetchedAssignments = [];

                if (
                    formationsRes.status === "fulfilled"
                ) {
                    fetchedFormations = normalizeData(
                        formationsRes.value?.data,
                        "formations"
                    );
                }

                if (
                    participantsRes.status === "fulfilled"
                ) {
                    const participants = normalizeData(
                        participantsRes.value?.data,
                        "participents"
                    );

                    fetchedParticipantsCount =
                        Array.isArray(participants)
                            ? participants.length
                            : 0;
                }

                if (
                    assignmentsRes.status === "fulfilled"
                ) {
                    fetchedAssignments = normalizeData(
                        assignmentsRes.value?.data,
                        "assignments"
                    );
                }

                const safeFormations = Array.isArray(
                    fetchedFormations
                )
                    ? fetchedFormations
                    : [];

                let filteredFormations = safeFormations;

                if (isClient) {
                    const myAssignments =
                        fetchedAssignments.filter(
                            (a) =>
                                a.participent_id ===
                                    user?.participent?.id ||
                                a.username ===
                                    user?.username ||
                                (user?.nom &&
                                    a.nom === user.nom)
                        );

                    const formationIds =
                        myAssignments.map(
                            (a) => a.formation_id
                        );

                    filteredFormations =
                        safeFormations.filter((f) =>
                            formationIds.includes(
                                f.id
                            )
                        );
                }

                if (isTrainer) {
                    const animId = user?.animater?.id;
                    filteredFormations =
                        safeFormations.filter(
                            (f) =>
                                (Array.isArray(f.animateurs) && f.animateurs.some(a => a.id === animId)) ||
                                f.animateur_id === animId ||
                                f.animateur === user?.username ||
                                (typeof f.animateur === "string" && user?.nom && f.animateur.includes(user.nom))
                        );
                }

                const active =
                    safeFormations.filter((f) => {
                        if (
                            !f.date_debut ||
                            !f.date_fin
                        )
                            return false;

                        const start = new Date(
                            f.date_debut
                        );

                        const end = new Date(
                            f.date_fin
                        );

                        return (
                            today >= start &&
                            today <= end
                        );
                    }).length;

                const upcoming =
                    safeFormations.filter((f) => {
                        if (!f.date_debut)
                            return false;

                        return (
                            new Date(
                                f.date_debut
                            ) > today
                        );
                    }).length;

                setStats({
                    total: safeFormations.length,
                    active,
                    participants:
                        fetchedParticipantsCount,
                    upcoming,
                });

                setAssignments(
                    fetchedAssignments
                );

                setFormations(
                    filteredFormations
                );
            } catch (err) {
                console.error(err);
                setError(
                    "Erreur lors du chargement des données."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Auto-select first formation when data loads
    useEffect(() => {
        if (formations.length > 0 && !selectedFormation) {
            setSelectedFormation(formations[0]);
        }
    }, [formations]);

    const assignmentsByFormation = useMemo(() => {
        return assignments.reduce((acc, item) => {
            if (!acc[item.formation_id]) {
                acc[item.formation_id] = [];
            }

            acc[item.formation_id].push(item);

            return acc;
        }, {});
    }, [assignments]);

    const getStatus = (formation) => {
        if (
            !formation.date_debut ||
            !formation.date_fin
        ) {
            return {
                label: "Inconnu",
                className: "upcoming",
            };
        }

        const start = new Date(
            formation.date_debut
        );

        const end = new Date(
            formation.date_fin
        );

        if (today < start) {
            return {
                label: "À Venir",
                className: "upcoming",
            };
        }

        if (today > end) {
            return {
                label: "Terminé",
                className: "finished",
            };
        }

        return {
            label: "En Cours",
            className: "active",
        };
    };

    return (
        <div
            className={`main dashboard-content ${
                className || ""
            }`}
        >
            <header className="dashboard-header mb-8">
                <div className="welcome-section">
                    <h1 className="welcome-title">
                        Bienvenue,{" "}
                        {user?.username ||
                            "Utilisateur"}{" "}
                        !
                    </h1>

                    <p className="welcome-subtitle">
                        {isAdmin
                            ? "Voici ce qui se passe avec vos programmes de formation aujourd'hui."
                            : isTrainer
                            ? "Gérez vos sessions et suivez la présence des étudiants."
                            : "Restez à jour avec votre emploi du temps et vos supports de formation."}
                    </p>
                </div>

                <div className="date-display">
                    <Calendar size={18} />

                    <span>
                        {today.toLocaleDateString(
                            "fr-FR",
                            {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    </span>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>

                    <p>
                        Chargement de votre
                        tableau de bord...
                    </p>
                </div>
            ) : error ? (
                <div className="error-box">
                    <AlertCircle size={20} />
                    <span>{error}</span>
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
                                    <span className="label">
                                        Total
                                        Participants
                                    </span>

                                    <h2 className="value">
                                        {
                                            stats.participants
                                        }
                                    </h2>

                                    <span className="trend positive">
                                        <TrendingUp size={14} />
                                        +12% depuis le
                                        mois dernier
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon purple">
                                    <BookOpen size={24} />
                                </div>

                                <div className="card-info">
                                    <span className="label">
                                        Formations
                                        Actives
                                    </span>

                                    <h2 className="value">
                                        {stats.active}
                                    </h2>

                                    <span className="trend positive">
                                        <TrendingUp size={14} />
                                        {
                                            stats.upcoming
                                        }{" "}
                                        à venir
                                    </span>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon green">
                                    <Hotel size={24} />
                                </div>

                                <div className="card-info">
                                    <span className="label">
                                        Total
                                        Formations
                                    </span>

                                    <h2 className="value">
                                        {stats.total}
                                    </h2>

                                    <span className="trend neutral">
                                        Suivi en
                                        Direct
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {isTrainer && (() => {
                        const sf = selectedFormation || formations[0];
                        return (
                            <>
                                {/* SESSION DETAIL CARD */}
                                <div className="wide-card premium-card">
                                    <div className="card-header-flex">
                                        <h3 className="section-title">
                                            <Clock size={20} />
                                            Session Sélectionnée
                                        </h3>
                                        <NavLink to="/absences" className="action-link">
                                            Gérer les Absences <ArrowRight size={16} />
                                        </NavLink>
                                    </div>

                                    {sf ? (
                                        <div className="session-info-box">
                                            <div className="session-details">
                                                <h4>{sf.title}</h4>
                                                <p>
                                                    <Calendar size={14} />
                                                    {sf.date_debut
                                                        ? `${sf.date_debut} → ${sf.date_fin}`
                                                        : "Date non définie"}
                                                </p>
                                                <p>
                                                    <Users size={14} />
                                                    {assignmentsByFormation[sf.id]?.length || 0} Participant(s)
                                                </p>
                                                {Array.isArray(sf.animateurs) && sf.animateurs.length > 0 && (
                                                    <p className="animateurs-pill-row">
                                                        {sf.animateurs.map((a, i) => (
                                                            <span key={a.id || i} className="animateur-pill">
                                                                {a.prenom} {a.nom}
                                                            </span>
                                                        ))}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                className="primary-btn-sm"
                                                onClick={() => {
                                                    setExpandedFormationId(sf.id);
                                                    setTimeout(() => {
                                                        tableRef.current?.scrollIntoView({
                                                            behavior: "smooth",
                                                            block: "start",
                                                        });
                                                    }, 80);
                                                }}
                                            >
                                                Voir la liste ↓
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="empty-section-state" style={{ margin: '16px 0' }}>
                                            Aucune formation assignée.
                                        </div>
                                    )}
                                </div>

                                {/* MES FORMATIONS LIST CARD */}
                                <div className="stat-card premium-card trainer-formations-card">
                                    <div className="card-header-flex" style={{ marginBottom: 14 }}>
                                        <span className="label" style={{ fontSize: '0.8rem' }}>
                                            MES FORMATIONS ({formations.length})
                                        </span>
                                    </div>
                                    <div className="trainer-formation-list">
                                        {formations.length > 0 ? formations.map((f) => {
                                            const isSelected = (sf?.id === f.id);
                                            return (
                                                <div
                                                    key={f.id}
                                                    className={`trainer-formation-item${isSelected ? ' selected' : ''}`}
                                                    onClick={() => {
                                                        setSelectedFormation(f);
                                                        setExpandedFormationId(f.id);
                                                        setTimeout(() => {
                                                            tableRef.current?.scrollIntoView({
                                                                behavior: "smooth",
                                                                block: "start",
                                                            });
                                                        }, 80);
                                                    }}
                                                >
                                                    <span className="tfi-title">{f.title}</span>
                                                    <span className="tfi-date">{f.date_debut || '—'}</span>
                                                </div>
                                            );
                                        }) : (
                                            <div className="empty-section-state">Aucune formation.</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    })()}

                    {isClient && (
                        <>
                            <div className="wide-card premium-card">
                                <div className="card-header-flex">
                                    <h3 className="section-title">
                                        <Award size={20} />
                                        Votre
                                        Progression
                                    </h3>

                                    <NavLink
                                        to="/schedule"
                                        className="action-link"
                                    >
                                        Voir
                                        l'emploi du
                                        temps
                                        <ArrowRight size={16} />
                                    </NavLink>
                                </div>

                                <div className="progress-container">
                                    <div className="progress-info">
                                        <span>
                                            {formations[0]
                                                ?.title ||
                                                "Formation"}
                                        </span>

                                        <span>
                                            65%
                                            Terminé
                                        </span>
                                    </div>

                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width:
                                                    "65%",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card premium-card">
                                <div className="card-icon green">
                                    <CheckCircle size={24} />
                                </div>

                                <div className="card-info">
                                    <span className="label">
                                        Inscriptions
                                    </span>

                                    <h2 className="value">
                                        {
                                            formations.length
                                        }
                                    </h2>

                                    <span className="trend neutral">
                                        Cours
                                        actifs
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <div ref={tableRef} className="recent-table-card premium-card full-width">
                        <div className="recent-header">
                            <h3>
                                {isAdmin
                                    ? "Formations Récentes"
                                    : isTrainer
                                    ? "Mes Formations"
                                    : "Mes Sessions"}
                            </h3>

                            <button className="view-all-btn">
                                Exporter les
                                Données
                            </button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            Formation
                                        </th>
                                        <th>
                                            Durée
                                        </th>
                                        <th>
                                            Période
                                        </th>
                                        <th>
                                            Animateur
                                        </th>
                                        <th>
                                            Statut
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {formations.length >
                                    0 ? (
                                        formations
                                            .slice(
                                                0,
                                                5
                                            )
                                            .map(
                                                (
                                                    f,
                                                    index
                                                ) => {
                                                    const status =
                                                        getStatus(
                                                            f
                                                        );

                                                    const participants =
                                                        assignmentsByFormation[
                                                            f
                                                                .id
                                                        ] ||
                                                        [];

                                                    return (
                                                        <React.Fragment
                                                            key={
                                                                f.id ||
                                                                index
                                                            }
                                                        >
                                                            <tr
                                                                className="clickable-row"
                                                                onClick={() => {
                                                                    setExpandedFormationId(
                                                                        expandedFormationId ===
                                                                            f.id
                                                                            ? null
                                                                            : f.id
                                                                    );
                                                                }}
                                                            >
                                                                <td className="font-semibold">
                                                                    {
                                                                        f.title
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        f.duree
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        f.date_debut
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        f.date_fin
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {f.animateur || (Array.isArray(f.animateurs) && f.animateurs.length > 0 ? f.animateurs.map(a => `${a.prenom} ${a.nom}`).join(', ') : "Non Assigné")}
                                                                </td>

                                                                <td>
                                                                    <div className="status-wrapper">
                                                                        <span
                                                                            className={`status-pill ${status.className}`}
                                                                        >
                                                                            {
                                                                                status.label
                                                                            }
                                                                        </span>

                                                                        {(isTrainer || isAdmin) && (
                                                                            <span className="participants-badge-trigger">
                                                                                {participants.length} Étudiants {expandedFormationId === f.id ? "▲" : "▼"}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            {(isTrainer || isAdmin) &&
                                                                expandedFormationId ===
                                                                    f.id && (
                                                                    <tr>
                                                                        <td
                                                                            colSpan="5"
                                                                            className="expanded-cell"
                                                                        >
                                                                            <div className="expanded-details-container">
                                                                                
                                                                                {/* ANIMATEUR DETAILS SECTION */}
                                                                                <div className="details-section animateurs-section">
                                                                                    <h4 className="section-subtitle">
                                                                                        <Users size={16} />
                                                                                        Détails de l'Animateur
                                                                                    </h4>
                                                                                    {Array.isArray(f.animateurs) && f.animateurs.length > 0 ? (
                                                                                        <table className="details-subtable animateurs-table">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>Nom Complet</th>
                                                                                                    {/* <th>Email</th>
                                                                                                    <th>Téléphone</th> */}
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {f.animateurs.map((anim, idx) => (
                                                                                                    <tr key={anim.id || idx}>
                                                                                                        <td className="font-semibold">{anim.prenom} {anim.nom}</td>
                                                                                                        {/* <td>{anim.email || "-"}</td>
                                                                                                        <td>{anim.telephone || "-"}</td> */}
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    ) : (
                                                                                        <div className="empty-section-state">
                                                                                            Aucun animateur assigné à cette formation.
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* PARTICIPANTS SECTION */}
                                                                                <div className="details-section participants-section">
                                                                                    <h4 className="section-subtitle">
                                                                                        <Users size={16} />
                                                                                        Liste des Participants ({participants.length})
                                                                                    </h4>
                                                                                    {participants.length > 0 ? (
                                                                                        <table className="details-subtable participants-table">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>Nom</th>
                                                                                                    <th>Email</th>
                                                                                                    <th>Téléphone</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {participants.map((p) => (
                                                                                                    <tr key={p.id}>
                                                                                                        <td>{p.prenom} {p.nom}</td>
                                                                                                        <td>{p.email}</td>
                                                                                                        <td>{p.telephone || "-"}</td>
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    ) : (
                                                                                        <div className="empty-section-state">
                                                                                            Aucun participant inscrit à cette formation.
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                        </React.Fragment>
                                                    );
                                                }
                                            )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="empty-state"
                                            >
                                                <BookOpen size={42} />

                                                <p>
                                                    Aucune
                                                    formation
                                                    disponible.
                                                </p>
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
                    animation: fadeIn 0.4s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                }

                .welcome-title {
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    color: #0f172a;
                }

                .welcome-subtitle {
                    color: #64748b;
                }

                .date-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: white;
                    padding: 10px 16px;
                    border-radius: 999px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
                    gap: 24px;
                }

                .premium-card {
                    background: white;
                    border-radius: 20px;
                    padding: 28px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                    transition: 0.3s;
                }

                .premium-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }

                .card-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .blue {
                    background: #eff6ff;
                    color: #2563eb;
                }

                .purple {
                    background: #f3e8ff;
                    color: #7c3aed;
                }

                .green {
                    background: #ecfdf5;
                    color: #16a34a;
                }

                .indigo {
                    background: #eef2ff;
                    color: #4f46e5;
                }

                .label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                }

                .value {
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 4px 0;
                }

                .trend {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .positive {
                    color: #10b981;
                }

                .neutral {
                    color: #64748b;
                }

                .wide-card {
                    grid-column: span 2;
                }

                .full-width {
                    grid-column: 1 / -1;
                }

                .card-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .action-link {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.85rem;
                    color: var(--primary);
                    font-weight: 600;
                }

                .session-info-box {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .session-details h4 {
                    margin-bottom: 10px;
                    font-size: 1.2rem;
                }

                .session-details p {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 6px 0;
                    color: #64748b;
                }

                .animateurs-pill-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 10px !important;
                }

                .animateur-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #eef2ff;
                    color: #4f46e5;
                    border: 1px solid #c7d2fe;
                    padding: 3px 10px;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 600;
                }

                .trainer-formations-card {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .trainer-formation-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    max-height: 220px;
                    overflow-y: auto;
                    padding-right: 4px;
                }

                .trainer-formation-list::-webkit-scrollbar {
                    width: 4px;
                }

                .trainer-formation-list::-webkit-scrollbar-thumb {
                    background: #c7d2fe;
                    border-radius: 999px;
                }

                .trainer-formation-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 14px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    background: #f8fafc;
                }

                .trainer-formation-item:hover {
                    border-color: #6366f1;
                    background: #eef2ff;
                    transform: translateX(2px);
                }

                .trainer-formation-item.selected {
                    border-color: #6366f1;
                    background: #eef2ff;
                    box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
                }

                .tfi-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 70%;
                }

                .tfi-date {
                    font-size: 0.75rem;
                    color: #64748b;
                    white-space: nowrap;
                }

                .primary-btn-sm {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .progress-container {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 16px;
                }

                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-weight: 700;
                }

                .progress-bar-bg {
                    height: 10px;
                    background: #e2e8f0;
                    border-radius: 999px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: 999px;
                }

                .recent-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .view-all-btn {
                    background: #f1f5f9;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .table-container {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 850px;
                }

                th,
                td {
                    padding: 16px;
                    text-align: left;
                    border-bottom: 1px solid #f1f5f9;
                }

                th {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: #64748b;
                }

                .status-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .status-pill {
                    padding: 5px 12px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .status-pill.active {
                    background: #ecfdf5;
                    color: #059669;
                }

                .status-pill.upcoming {
                    background: #fef3c7;
                    color: #d97706;
                }

                .status-pill.finished {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .participants-badge-trigger {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    background: #eef2ff;
                    padding: 4px 10px;
                    border-radius: 999px;
                }

                .participants-box {
                    padding: 20px;
                    background: #f8fafc;
                    border-left: 4px solid var(--primary);
                }

                .participants-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    font-size: 0.95rem;
                }

                .participants-table {
                    width: 100%;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .participants-table th {
                    background: #f1f5f9;
                }

                .expanded-details-container {
                    padding: 24px;
                    background: #f8fafc;
                    border-left: 4px solid var(--primary);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .details-section {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }

                .section-subtitle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .details-subtable {
                    width: 100%;
                    border-collapse: collapse;
                }

                .details-subtable th {
                    background: #f8fafc;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #64748b;
                    padding: 10px 14px;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                }

                .details-subtable td {
                    padding: 12px 14px;
                    font-size: 0.875rem;
                    color: #334155;
                    border-bottom: 1px solid #f1f5f9;
                }

                .empty-section-state {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    text-align: center;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border: 1px dashed #e2e8f0;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #94a3b8;
                }

                .empty-state svg {
                    margin-bottom: 12px;
                }

                .loading-state {
                    min-height: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .error-box {
                    background: #fee2e2;
                    color: #dc2626;
                    border-radius: 14px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }

                .clickable-row {
                    cursor: pointer;
                }

                @media (max-width: 1024px) {
                    .wide-card {
                        grid-column: span 1;
                    }

                    .dashboard-header {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .session-info-box {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                }
            `}</style>
        </div>
    );
}