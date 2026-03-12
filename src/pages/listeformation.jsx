import { useState } from "react";
import Formations from "./formations";
import Aside from "../components/aside";
import Header from "../components/header";
import '../styles/dashboard.css'
export default function ListeFormation({ username, onLogout }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newFormation, setNewFormation] = useState({
        nom: "",
        description: "",
        duree: "",
        date_debut: "",
        date_fin: ""
    });

    const [data, setData] = useState([
        {
            nom: "back end",
            description: "loremzeedez",
            duree: 20,
            date_debut: "20/01/2020",
            date_fin: "20/04/2021",
        },
        {
            nom: "front end",
            description: "loremzeedez",
            duree: 18,
            date_debut: "20/05/2023",
            date_fin: "19/04/2025",
        }
    ]);

    const handleChange = (e) => {
        setNewFormation({
            ...newFormation,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNewFormation(data[index]);
        setShowForm(true);
    };

    const handleAdd = () => {

        if (editingIndex !== null) {

            const updated = [...data];
            updated[editingIndex] = newFormation;

            setData(updated);
            setEditingIndex(null);

        } else {
            if (!newFormation.nom || !newFormation.duree) {
                alert("Nom and durée are required")
                return
            }

            setData([...data, newFormation]);

        }

        setNewFormation({
            nom: "",
            description: "",
            duree: "",
            date_debut: "",
            date_fin: ""
        });

        setShowForm(false);
    };

    const handleDelete = (index) => {
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="position-relative">
            <Header onLogout={onLogout} username={username} />
            <Aside />

            <div
                className="main"
                style={{
                    top: "100px",
                    right: "100px",
                    height: "calc(100vh - 100px)"
                }}
            >
                <div className="container">
                    <div className="row ">
                        {data.map((formation, index) => (
                            <Formations
                                key={index}
                                formation={formation}
                                Supp={() => handleDelete(index)}
                                Edit={() => handleEdit(index)}
                            />
                        ))}
                    </div>
                    <button
                        className="btn btn-success mb-3"
                        onClick={() => setShowForm(true)}
                    >
                        Ajouter Formation
                    </button>
                    {showForm && (
                        <div className="modal-overlay" onClick={() => setShowForm(false)}>
                            <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                                <h4>Ajouter Formation</h4>

                                <input
                                    className="form-control mb-2"
                                    placeholder="Nom"
                                    name="nom"
                                    value={newFormation.nom}
                                    onChange={handleChange}
                                />

                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Description"
                                    name="description"
                                    value={newFormation.description}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-2"
                                    type="number"
                                    placeholder="Durée"
                                    name="duree"
                                    value={newFormation.duree}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-2"
                                    type="date"
                                    name="date_debut"
                                    value={newFormation.date_debut}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-2"
                                    type="date"
                                    name="date_fin"
                                    value={newFormation.date_fin}
                                    onChange={handleChange}
                                />

                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn btn-primary" onClick={handleAdd}>
                                        {editingIndex !== null ? "Update Formation" : "Ajouter"}
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Annuler
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}