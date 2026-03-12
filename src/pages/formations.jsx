export default function Formations({ formation, Supp , Edit}) {
    return (
        <div className="col-md-4 col-3 mb-3">
            <div className="card formation-card p-3 mb-3">
                <h4>{formation.nom}</h4>
                <p>{formation.description}</p>
                <p><b>Durée:</b> {formation.duree} mois</p>
                <p><b>Début:</b> {formation.date_debut}</p>
                <p><b>Fin:</b> {formation.date_fin}</p>

                <button className="btn btn-danger" onClick={Supp}>
                    Supprimer
                </button>
                <button className="btn btn-warning me-2" onClick={Edit}>
                    Edit
                </button>
            </div>
        </div>
    );
}