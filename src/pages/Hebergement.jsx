import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete, Put } from "../api/api"
import '../styles/dashboard.css'

export default function Hebergement({ username, onLogout }) {
    const [hebergements, setHebergements] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [formData, setFormData] = useState({
        participent_id: "",
        lieu: "",
        date_debut: "",
        date_fin: "",
        prix: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHebergements();
        fetchParticipants();
    }, []);

    const fetchHebergements = async () => {
        try {
            const res = await Get('hebergements');
            setHebergements(res.data.hebergements || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching hebergements:", err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await Get('participents');
            setParticipants(res.data.participents || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching participants:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.participent_id || !formData.lieu || !formData.date_debut || !formData.date_fin) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            if (editingId) {
                await Put(`hebergements/${editingId}`, formData);
                alert("Hébergement modifié avec succès !");
            } else {
                await Post('hebergements', formData);
                alert("Hébergement ajouté avec succès !");
            }
            setFormData({ participent_id: "", lieu: "", date_debut: "", date_fin: "", prix: "" });
            setEditingId(null);
            fetchHebergements();
        } catch (err) {
            console.error("Error saving hebergement:", err);
            const serverError = err.response?.data?.message || err.response?.data?.error || "";
            setError(`Une erreur est survenue lors de l'enregistrement. ${serverError}`);
        }
    };

    const handleEdit = (h) => {
        setEditingId(h.id);
        setFormData({
            participent_id: h.participent_id,
            lieu: h.lieu,
            date_debut: h.date_debut,
            date_fin: h.date_fin,
            prix: h.prix || ""
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet hébergement ?")) {
            try {
                await Delete(`hebergements/${id}`);
                fetchHebergements();
            } catch (err) {
                console.error("Error deleting hebergement:", err);
            }
        }
    };

    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={username} />
            <div className="dashboard-body">
                <Aside />
                <div className="main-content" style={{ marginLeft: "250px", padding: "40px", flex: 1, overflowY: "auto", height: "100vh", marginTop: "80px" }}>
                    <div className="container" style={{ maxWidth: "1000px", background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <h2 className="mb-4" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                            {editingId ? "Modifier Hébergement" : "Gestion de l'Hébergement"}
                        </h2>

                        <form onSubmit={handleSubmit} className="mb-5">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Participant</label>
                                    <select
                                        className="form-control"
                                        name="participent_id"
                                        value={formData.participent_id}
                                        onChange={handleChange}
                                    >
                                        <option value=""> -- Choisir un participant -- </option>
                                        {participants.map(p => (
                                            <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Lieu / Hôtel</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lieu"
                                        value={formData.lieu}
                                        onChange={handleChange}
                                        placeholder="Nom de l'hôtel ou lieu"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Date Début</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date_debut"
                                        value={formData.date_debut}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Date Fin</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date_fin"
                                        value={formData.date_fin}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Prix (Optionnel)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="prix"
                                        value={formData.prix}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {error && <div className="alert alert-danger mt-2">{error}</div>}

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                {editingId && (
                                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ participent_id: "", lieu: "", date_debut: "", date_fin: "", prix: "" }); }}>
                                        Annuler
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary px-4">
                                    {editingId ? "Modifier" : "Ajouter Hébergement"}
                                </button>
                            </div>
                        </form>

                        <h4 className="mb-3" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                            Liste des Hébergements
                        </h4>
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Participant</th>
                                    <th>Lieu</th>
                                    <th>Période</th>
                                    <th>Prix</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hebergements.length > 0 ? hebergements.map((h) => (
                                    <tr key={h.id}>
                                        <td>{h.participant?.nom} {h.participant?.prenom}</td>
                                        <td>{h.lieu}</td>
                                        <td>Du {h.date_debut} au {h.date_fin}</td>
                                        <td>{h.prix ? `${h.prix} DH` : '-'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(h)}>Modifier</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(h.id)}>Supprimer</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-3">Aucun hébergement trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
