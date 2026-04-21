import { useState,useEffect } from "react";
import Formations from "./formations";
import Aside from "../components/aside";
import Header from "../components/header";
import '../styles/dashboard.css';
import { Get, Post, Put, Delete } from "../api/api";
export default function ListeFormation({ username, onLogout }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newFormation, setNewFormation] = useState({
        title: "",
        description: "",
        duree: "",
        date_debut: "",
        date_fin: ""
    });

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const res = await Get('formations');
                setData(res.data.formations || res.data.data || res.data);
            } catch (err) {
                console.error("Error fetching formations:", err);
            }
        };
        fetchFormations();
    }, []);

    const handleChange = (e) => {
        setNewFormation({
            ...newFormation,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNewFormation({ ...data[index] });
        setShowForm(true);
    };

    const handleAdd = async () => {
        if (!newFormation.title.trim() || !newFormation.duree) {
            alert("Titre and durée are required");
            return;
        }

        try {
            if (editingIndex !== null) {
                const formationId = data[editingIndex].id;
                const res = await Put(`formations/${formationId}`, newFormation);
                const updatedData = [...data];
                updatedData[editingIndex] = res.data.data || res.data || newFormation;
                setData(updatedData);
                setEditingIndex(null);
            } else {
                const res = await Post('formations', newFormation);
                setData([...data, res.data.data || res.data || newFormation]);
            }
            resetForm();
        } catch (err) {
            console.error("Error saving formation:", err);
        }
    };

    const resetForm = () => {
        setNewFormation({
            title: "",
            description: "",
            duree: "",
            date_debut: "",
            date_fin: ""
        });
        setShowForm(false);
    };

    const handleDelete = async (index) => {
        const formationId = data[index].id;
        if (!formationId) {
            setData((prev) => prev.filter((_, i) => i !== index));
            return;
        }

        try {
            await Delete(`formations/${formationId}`);
            setData((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Error deleting formation:", err);
        }
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
                    <button
                        className="btn btn-success mb-3"
                        onClick={() => {setShowForm(true)
                            setEditingIndex(null)}
                        }
                    >
                        Ajouter Formation
                    </button>
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
                    
                    {showForm && (
                        <div className="modal-overlay" onClick={() => setShowForm(false)}>
                            <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                                <div className="b">{editingIndex !== null ? "Modifier Formation" : "Ajouter Formation"}</div>

                                <input
                                    className="form-control mb-2"
                                    placeholder="Titre"
                                    name="title"
                                    value={newFormation.title}
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
                                        {editingIndex !== null ? "Modifier" : "Ajouter"}
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