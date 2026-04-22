import { useEffect, useState } from "react";
import { Get } from "../api/api";

export default function Main() {
    const [formations, setFormations] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        participants: 0,
        upcoming: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formationsRes, participantsRes] = await Promise.allSettled([
                    Get('formations'),
                    Get('participents')
                ]);

                let fetchedFormations = [];
                let fetchedParticipantsCount = 0;

                if (formationsRes.status === 'fulfilled' && formationsRes.value?.data) {
                    const rawData = formationsRes.value.data;
                    fetchedFormations = rawData.formations || rawData.data || rawData || [];
                    setFormations(Array.isArray(fetchedFormations) ? fetchedFormations : []);
                }

                if (participantsRes.status === 'fulfilled' && participantsRes.value?.data) {
                    const rawData = participantsRes.value.data;
                    const participentsList = rawData.participents || rawData.data || rawData || [];
                    fetchedParticipantsCount = Array.isArray(participentsList) ? participentsList.length : 0;
                }

                const today = new Date();
                const safeFormations = Array.isArray(fetchedFormations) ? fetchedFormations : [];

                const active = safeFormations.filter(f => {
                    if (!f.date_debut || !f.date_fin) return false;
                    const start = new Date(f.date_debut);
                    const end = new Date(f.date_fin);
                    return today >= start && today <= end;
                }).length;

                const upcoming = safeFormations.filter(f => {
                    if (!f.date_debut) return false;
                    return new Date(f.date_debut) > today;
                }).length;

                setStats({
                    total: safeFormations.length,
                    active,
                    participants: fetchedParticipantsCount,
                    upcoming
                });

            } catch (err) {
                console.error("Dashboard Data Fetch Error:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="main">

            <h2 className="dashboard-title">Dashboard</h2>

            <div className="cards">

                <div className="card">
                    <h3>Total Formations</h3>
                    <p>{stats.total}</p>
                </div>

                <div className="card">
                    <h3>Active Formations</h3>
                    <p>{stats.active}</p>
                </div>

                <div className="card">
                    <h3>Participants</h3>
                    <p>{stats.participants}</p>
                </div>

                <div className="card">
                    <h3>Upcoming</h3>
                    <p>{stats.upcoming}</p>
                </div>

            </div>

            <div className="recent">
                <h3>Recent Formations</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>

                    <tbody>
                        {formations.slice(0, 5).map((f, index) => (
                            <tr key={f.id || index}>
                                <td>{f.title}</td>
                                <td>{f.duree}</td>
                                <td>{f.date_debut}</td>
                                <td>{f.date_fin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </main>
    )
}