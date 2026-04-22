import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Get, Put, Post, Delete } from "../api/api"
export default function AjouterAuFormation({ username, onLogout }) {
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [selections, setSelections] = useState({
        animateurs: [],
        themes: []
    });

    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [selectedPivotIds, setSelectedPivotIds] = useState([]);

    const [data, setData] = useState([]);
    useEffect(() => {
        Get('formations')
            .then(res => setData(res.data.formations || res.data.data || res.data))
            .catch(err => console.error("Error fetching formations:", err));
    }, []);
    
    const [themes, setThemes] = useState([]);
    useEffect(() => {
        Get('themes')
            .then(res => setThemes(res.data.themes || res.data.data || (Array.isArray(res.data) ? res.data : [])))
            .catch(err => console.error("Error fetching themes:", err));
    }, []);


    const [animateurs, setAnimateurs] = useState([]);
    useEffect(() => {
        Get('animateurs')
            .then(res => setAnimateurs(res.data.animators || res.data.animateurs || res.data.data || (Array.isArray(res.data) ? res.data : [])))
            .catch(err => console.error("Error fetching animateurs:", err));
    }, []);
    
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
            setError("Veuillez sélectionner au moins une formation dans le tableau.");
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
                        promises.push(
                            Post(`pivot`, updatedRow).then(() => ({ index, updatedRow }))
                        );
                    });
                });
            });

            await Promise.all(promises);

            // Fetch the updated formations from the backend to get the latest pivoting
            const res = await Get('formations');
            setData(res.data.formations || res.data.data || res.data);
            
            setSelectedIndexes([]);
            setSelectedPivotIds([]);

            alert("Formations affectées avec succès !");
            navigate("/add");
        } catch (err) {
            console.error("Error updating formations:", err);
            setError("Une erreur est survenue lors de l'affectation des formations.");
        }
    };

    const desaffecter = async () => {
        if (selectedPivotIds.length === 0 && (selections.themes.length === 0 || selections.animateurs.length === 0)) {
            setError("Veuillez sélectionner des formations à désaffecter (cocher) ou choisir un thème et un animateur dans les listes.");
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
                const themesToProcess = selections.themes.length > 0 
                    ? selections.themes 
                    : (row.themes?.map(t => String(t.id)) || []);
                
                const animateursToProcess = selections.animateurs.length > 0 
                    ? selections.animateurs 
                    : (row.animateurs?.map(a => String(a.id)) || []);

                themesToProcess.forEach((themeId) => {
                    animateursToProcess.forEach((animateurId) => {
                        const dataToDelete = {
                            formation_id: row.id,
                            theme_id: themeId,
                            animater_id: animateurId
                        };
                        promises.push(Delete(`pivot`, dataToDelete));
                    });
                });
            });

            await Promise.all(promises);

            const res = await Get('formations');
            setData(res.data.formations || res.data.data || res.data);
            setSelectedPivotIds([]);

            alert("Désaffectation effectuée avec succès !");
        } catch (err) {
            console.error("Error desaffecting formations:", err);
            setError("Une erreur est survenue lors de la désaffectation.");
        }
    };

    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={username} />
            <div className="dashboard-body">
                <Aside />
                <div className="main-content mt-5" style={{ marginLeft: "250px", padding: "40px", flex: 1, overflowY: "auto", height: "100vh" }}>
                    <div className="container" style={{ maxWidth: "800px", background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <h2 className="mb-4" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Affecter un Thème et un Animateur</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-around">
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Thème principal</label>
                                    <select
                                        multiple
                                        className="form-control"
                                        name="themes"
                                        value={selections.themes}
                                        onChange={handleSelectChange}
                                        style={{ height: '150px' }}
                                    >
                                        {/* <option value="" disabled>Sélectionnez un ou plusieurs thèmes</option> */}

                                        {themes.map((c, index) => (
                                            <option key={index} value={c?.id}>
                                                {c?.title ? c.title.charAt(0).toUpperCase() + c.title.slice(1) : "Sans Nom"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Animateurs</label>
                                    <select
                                        multiple
                                        className="form-control"
                                        name="animateurs"
                                        value={selections.animateurs}
                                        onChange={handleSelectChange}
                                        style={{ height: '150px' }}
                                    >
                                        {/* <option value="" disabled>Sélectionnez un ou plusieurs animateurs</option> */}
                                        
                                        {animateurs.map((c, index) => (
                                            <option key={index} value={c?.id}>
                                                {c?.nom ? c.nom.charAt(0).toUpperCase() + c.nom.slice(1) : "Sans Nom"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                                <div className="mt-4 w-100">
                                    <h4 className="mb-3" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                                        1. Formations (Sélectionnez pour Affecter)
                                    </h4>
                                    <table className="table table-bordered table-hover mb-5">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Sélect</th>
                                                <th>Titre</th>
                                                <th>Description</th>
                                                <th>Durée</th>
                                                <th>Date début</th>
                                                <th>Date fin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((c, index) => (
                                                <tr key={`base-${index}`} onClick={() => toggleCheckbox(index)} style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedIndexes.includes(index)} 
                                                            onChange={() => toggleCheckbox(index)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td>{c.title}</td>
                                                    <td>{c.description}</td>
                                                    <td>{c.duree}</td>
                                                    <td>{c.date_debut}</td>
                                                    <td>{c.date_fin}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {data.length === 0 && <tbody><tr><td colSpan="6" className="text-center text-muted py-3">Aucune formation trouvée.</td></tr></tbody>}
                                    </table>

                                    <h4 className="mb-3" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                                        2. Affectations Actuelles (Pivot)
                                    </h4>
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Sélect</th>
                                                <th>Titre Formation</th>
                                                <th>Animateurs (actuels)</th>
                                                <th>Thèmes (actuels)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.filter(c => c.animateurs?.length > 0 || c.themes?.length > 0).map((c, index) => (
                                                <tr key={`pivot-${index}`} onClick={() => togglePivotCheckbox(c.id)} style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedPivotIds.includes(c.id)} 
                                                            onChange={() => togglePivotCheckbox(c.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className="fw-bold">{c.title}</td>
                                                    <td>{c.animateurs?.length > 0 ? c.animateurs.map(a => a.nom).join(', ') : '-'}</td>
                                                    <td>{c.themes?.length > 0 ? c.themes.map(t => t.title).join(', ') : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* message au cas uncune affectation */}
                                            {data.filter(c => c.animateurs?.length > 0 || c.themes?.length > 0).length === 0 && (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="4" className="text-center text-muted py-3">Aucune affectation active.</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                    </table>
                                </div>

                                <div className="w-100">
                                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                                </div>

                            <div className="d-flex justify-content-end gap-3 mt-4">
                                <button type="button" className="btn btn-secondary px-4" onClick={()=>desaffecter()}>
                                    Désaffecter (selon sélections)
                                </button>
                                <button type="submit" className="btn btn-primary px-4" style={{ backgroundColor: "#007bff" }}>
                                    Affecter (aux formations cochées)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}