import Aside from "../components/aside"
import Header from "../components/header"
import { useEffect, useState } from "react"
import { Get, Post, Delete } from "../api/api"
import '../styles/dashboard.css'

export default function AffecterParticipant({ username, onLogout }) {
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [assignments, setAssignments] = useState([]);
    
    const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);
    const [selectedFormationIds, setSelectedFormationIds] = useState([]);
    const [selectedAssignmentIds, setSelectedAssignmentIds] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Fetch participants
        Get('participents')
            .then(res => setParticipants(res.data.participents || res.data.data || res.data || []))
            .catch(err => console.error("Error fetching participants:", err));

        // Fetch formations
        Get('formations')
            .then(res => setFormations(res.data.formations || res.data.data || res.data || []))
            .catch(err => console.error("Error fetching formations:", err));

        // Fetch assignments
        Get('assignments')
            .then(res => setAssignments(res.data.assignments || res.data.data || res.data || []))
            .catch(err => console.error("Error fetching assignments:", err));
    };

    const toggleParticipant = (id) => {
        setSelectedParticipantIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleFormation = (id) => {
        setSelectedFormationIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAssignment = (formationId, participantId) => {
        const key = `${formationId}-${participantId}`;
        setSelectedAssignmentIds(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const handleAffecter = async () => {
        setError("");
        if (selectedParticipantIds.length === 0 || selectedFormationIds.length === 0) {
            setError("Veuillez sélectionner au moins un participant et une formation.");
            return;
        }

        try {
            const promises = [];
            selectedParticipantIds.forEach(pId => {
                selectedFormationIds.forEach(fId => {
                    promises.push(Post('assignments', { participent_id: pId, formation_id: fId }));
                });
            });

            await Promise.all(promises);
            alert("Affectation réussie !");
            setSelectedParticipantIds([]);
            setSelectedFormationIds([]);
            fetchData();
        } catch (err) {
            console.error("Error assigning participants:", err);
            setError("Une erreur est survenue lors de l'affectation.");
        }
    };

    const handleDesaffecter = async () => {
        setError("");
        if (selectedAssignmentIds.length === 0) {
            setError("Veuillez sélectionner des affectations à supprimer.");
            return;
        }

        try {
            const promises = [];
            selectedAssignmentIds.forEach(key => {
                const [fId, pId] = key.split('-');
                promises.push(Delete('assignments', { formation_id: fId, participent_id: pId }));
            });

            await Promise.all(promises);
            alert("Désaffectation réussie !");
            setSelectedAssignmentIds([]);
            fetchData();
        } catch (err) {
            console.error("Error removing assignments:", err);
            setError("Une erreur est survenue lors de la désaffectation.");
        }
    };

    return (
        <div className="dashboard">
            <Header onLogout={onLogout} username={username} />
            <div className="dashboard-body">
                <Aside />
                <div className="main-content" style={{ marginLeft: "250px", padding: "40px", flex: 1, overflowY: "auto", height: "100vh", marginTop: "80px" }}>
                    <div className="container" style={{ maxWidth: "1000px", background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        <h2 className="mb-4" style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Affecter Participants aux Formations</h2>

                        <div className="row mt-4">
                            {/* Participants Selection */}
                            <div className="col-md-6">
                                <h4 className="mb-3">1. Choisir Participants</h4>
                                <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
                                    <table className="table table-sm table-hover">
                                        <thead>
                                            <tr>
                                                <th>Sélect</th>
                                                <th>Nom</th>
                                                <th>Prénom</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {participants.map(p => (
                                                <tr key={p.id} onClick={() => toggleParticipant(p.id)} style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <input type="checkbox" checked={selectedParticipantIds.includes(p.id)} onChange={() => {}} />
                                                    </td>
                                                    <td>{p.nom}</td>
                                                    <td>{p.prenom}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Formations Selection */}
                            <div className="col-md-6">
                                <h4 className="mb-3">2. Choisir Formations</h4>
                                <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "4px" }}>
                                    <table className="table table-sm table-hover">
                                        <thead>
                                            <tr>
                                                <th>Sélect</th>
                                                <th>Titre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formations.map(f => (
                                                <tr key={f.id} onClick={() => toggleFormation(f.id)} style={{ cursor: "pointer" }}>
                                                    <td>
                                                        <input type="checkbox" checked={selectedFormationIds.includes(f.id)} onChange={() => {}} />
                                                    </td>
                                                    <td>{f.title}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-center">
                            <button className="btn btn-primary px-5" onClick={handleAffecter}>Affecter Sélection</button>
                        </div>

                        {error && <div className="alert alert-danger mt-3">{error}</div>}

                        <hr className="my-5" />

                        <h4 className="mb-3">3. Affectations Actuelles</h4>
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Sélect</th>
                                        <th>Formation</th>
                                        <th>Participant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.length > 0 ? assignments.map((a, index) => (
                                        <tr key={index} onClick={() => toggleAssignment(a.formation_id, a.participent_id)} style={{ cursor: "pointer" }}>
                                            <td>
                                                <input type="checkbox" checked={selectedAssignmentIds.includes(`${a.formation_id}-${a.participent_id}`)} onChange={() => {}} />
                                            </td>
                                            <td className="fw-bold">{a.formation_title}</td>
                                            <td>{a.nom} {a.prenom}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-muted py-3">Aucune affectation trouvée.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 d-flex justify-content-end">
                            <button className="btn btn-danger" onClick={handleDesaffecter}>Désaffecter Sélection</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
