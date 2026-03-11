export default function Formations({formation,Supp}){
    return(
        <div className="card">
            <p className="card-text">{formation.nom}</p>
            <p>{formation.description}</p>
            <p>{formation.duree}</p>
            <p>{formation.date_debut}</p>
            <p>{formation.date_fin}</p>
            <button className="btn btn-danger" onClick={()=>Supp(formation.id)}>Supprimer</button>
        </div>
    )
}