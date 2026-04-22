import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete, Put } from "../api/api"
import '../styles/dashboard.css'

export default function AjouterParticipant({ username, onLogout }) {
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchParticipants();
        fetchFormations();
    }, []);

    const fetchParticipants = async () => {
        try {
            const res = await Get('participents');
            setParticipants(res.data.participents || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching participants:", err);
        }
    };

    const fetchFormations = async () => {
        try {
            const res = await Get('formations');
            setFormations(res.data.formations || res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching formations:", err);
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

        if (!formData.nom || !formData.prenom || !formData.email) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            if (editingId) {
                await Put(`participents/${editingId}`, formData);
                alert("Participant modifié avec succès !");
            } else {
                await Post('participents', formData);
                alert("Participant ajouté avec succès !");
            }
            setFormData({ nom: "", prenom: "", email: "" });
            setEditingId(null);
            fetchParticipants();
        } catch (err) {
            console.error("Error saving participant:", err);
            const serverError = err.response?.data?.message || err.response?.data?.error || "";
            setError(`Une erreur est survenue lors de l'enregistrement. ${serverError}`);
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            nom: p.nom,
            prenom: p.prenom,
            email: p.email
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
            try {
                await Delete(`participents/${id}`);
                fetchParticipants();
            } catch (err) {
                console.error("Error deleting participant:", err);
            }
        }
    };

    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={username} />
            <div className="dashboard-body">
                <Aside />
                <div className="main-content" style={{ marginLeft: "250px", padding: "40px", flex: 1, overflowY: "auto", height: "100vh", marginTop: "80px" }}>
                    <div className="container" style={{ maxWidth: "900px", background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <h2 className="mb-4" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                            {editingId ? "Modifier Participant" : "Ajouter un Participant à une Formation"}
                        </h2>

                        <form onSubmit={handleSubmit} className="mb-5">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Nom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder="Nom du participant"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        placeholder="Prénom du participant"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label" style={{ fontWeight: "bold" }}>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email du participant"
                                    />
                                </div>
                            </div>

                            {error && <div className="alert alert-danger mt-2">{error}</div>}

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                {editingId && (
                                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ nom: "", prenom: "", email: "" }); }}>
                                        Annuler
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary px-4">
                                    {editingId ? "Modifier" : "Ajouter Participant"}
                                </button>
                            </div>
                        </form>

                        <h4 className="mb-3" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                            Liste des Participants
                        </h4>
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.length > 0 ? participants.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nom}</td>
                                        <td>{p.prenom}</td>
                                        <td>{p.email}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Modifier</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-3">Aucun participant trouvé.</td>
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
