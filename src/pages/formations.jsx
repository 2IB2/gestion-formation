import { Link } from "react-router-dom";
export default function Formations({ formation, Supp, Edit }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card formation-card h-100 border-0 shadow">

                <div className="card-body d-flex flex-column">

                    {/* Title */}
                    <h5 className="formation-title">
                        📚 {formation.title}
                    </h5>

                    <p className="formation-desc">
                        {formation.description}
                    </p>

                    <div className="formation-info">

                        <div className="info-row">
                            ⏳ <span>{formation.duree} mois</span>
                        </div>

                        <div className="info-row">
                            📅 Début: <span>{formation.date_debut}</span>
                        </div>

                        <div className="info-row">
                            🏁 Fin: <span>{formation.date_fin}</span>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-auto d-flex justify-content-between pt-3">

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={Supp}
                        >
                            Supprimer
                        </button>
                        <Link to='/add' className="btn btn-primary">Add</Link>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={Edit}
                        >
                            Modifier
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}