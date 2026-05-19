import { Link } from "react-router-dom";
import { Calendar, Clock, Trash2, PlusCircle, Edit2, Pencil } from "lucide-react";

export default function Formations({ formation, Supp, Edit }) {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="formation-card">
                <div className="formation-card-header">
                    <h3 className="formation-title">{formation.title}</h3>
                    <span className="duration-tag">
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        {formation.duree} Mois
                    </span>
                </div>

                <div className="formation-body">
                    <p className="formation-desc">{formation.description}</p>

                    <div className="formation-dates">
                        <div className="date-item">
                            <span className="label">
                                <Calendar size={10} style={{ marginRight: '4px' }} /> Début
                            </span>
                            <span className="value">{formation.date_debut || 'À définir'}</span>
                        </div>
                        <div className="date-item">
                            <span className="label">
                                <Calendar size={10} style={{ marginRight: '4px' }} /> Fin
                            </span>
                            <span className="value">{formation.date_fin || 'À définir'}</span>
                        </div>
                    </div>
                </div>

                <div className="formation-actions-modern">
                    <button className="action-btn edit" onClick={Edit} title="Modifier">
                        <Pencil size={16} />
                    </button>

                    <button className="action-btn delete" onClick={Supp} title="Supprimer">
                        <Trash2 size={16} />
                    </button>

                    <Link to="/add" className="action-btn primary">
                        <PlusCircle size={16} />
                        <span>Détails</span>
                    </Link>
                </div>
            </div>

            <style jsx="true">{`
                /* =========================
   FORMATION CARD BASE
========================= */

.formation-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.formation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
}

/* =========================
   HEADER
========================= */

.formation-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
}

.formation-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
    line-height: 1.4;
}

.duration-tag {
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary);
    background: #eff6ff;
    padding: 4px 10px;
    border-radius: 99px;
    white-space: nowrap;
}

/* =========================
   BODY
========================= */

.formation-body {
    flex: 1;
}

.formation-desc {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.6;
}

.formation-dates {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: var(--radius-sm);
}

.date-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.date-item .label {
    display: flex;
    align-items: center;
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.date-item .value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-main);
}

/* =========================
   FLOATING ACTION BAR (SAAS STYLE)
========================= */

.formation-actions-modern {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 10px;
    border-radius: 16px;

    background: rgba(248, 250, 252, 0.85);
    backdrop-filter: blur(12px);

    border: 1px solid var(--border-color);

    transition: all 0.25s ease;
}

/* hover floating effect */
.formation-card:hover .formation-actions-modern {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    border-color: rgba(99, 102, 241, 0.25);
}

/* =========================
   ACTION BUTTONS
========================= */

.action-btn {
    width: 38px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;

    border: 1px solid transparent;

    background: white;

    cursor: pointer;

    transition: all 0.2s ease;

    color: #64748b;
}

/* IMPORTANT FIX for Lucide icons */
.action-btn svg {
    color: currentColor;
}

/* hover lift */
.action-btn:hover {
    transform: translateY(-2px);
}

/* EDIT BUTTON */
.action-btn.edit:hover {
    background: #eef2ff;
    color: #4f46e5;
    border-color: #c7d2fe;
}

/* DELETE BUTTON */
.action-btn.delete:hover {
    background: #fef2f2;
    color: #ef4444;
    border-color: #fecaca;
}

/* PRIMARY BUTTON (DETAILS) */
.action-btn.primary {
    flex: 1;
    width: auto;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    background: var(--primary);
    color: white;

    font-size: 0.8rem;
    font-weight: 600;

    border: none;
}

.action-btn.primary:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
    .formation-dates {
        flex-direction: column;
        gap: 12px;
    }

    .formation-actions-modern {
        flex-direction: row;
    }
}
            `}</style>
        </div>
    );
}
