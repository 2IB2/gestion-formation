import { Link } from "react-router-dom";
import { Calendar, Clock, Edit2, Trash2, PlusCircle } from "lucide-react";

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
                
                <div className="formation-actions">
                    <button className="icon-btn edit" onClick={Edit} title="Modifier">
                        <Edit2 size={16} stroke="#64748b" />
                    </button>
                    <button className="icon-btn delete" onClick={Supp} title="Supprimer">
                        <Trash2 size={16} stroke="#64748b" />
                    </button>
                    <Link to='/add' className="add-link">
                        <PlusCircle size={16} style={{ marginRight: '6px' }} /> Détails
                    </Link>
                </div>
            </div>

            <style jsx="true">{`
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
                    box-shadow: 0 12px 20px -10px rgba(0,0,0,0.1);
                    border-color: var(--primary);
                }
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
                .formation-actions {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                
                .icon-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-muted);
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .icon-btn.edit:hover { color: #5f6571ff; border-color: #5f6571ff; background: #f1f5f9; }
                .icon-btn.delete:hover { background: #fef2f2; color: #ef4444; border-color: #ef4444; }
                
                .add-link {
                    flex: 1;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary);
                    color: white;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    border-radius: 8px;
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .add-link:hover {
                    background: var(--primary-hover);
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
                }
                
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