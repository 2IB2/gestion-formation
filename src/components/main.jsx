export default function Main() {
    return (
        <main className="main">

            <h2 className="dashboard-title">Dashboard</h2>

            <div className="cards">

                <div className="card">
                    <h3>Total Formations</h3>
                    <p>12</p>
                </div>

                <div className="card">
                    <h3>Active Formations</h3>
                    <p>5</p>
                </div>

                <div className="card">
                    <h3>Users</h3>
                    <p>24</p>
                </div>

                <div className="card">
                    <h3>Upcoming</h3>
                    <p>3</p>
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
                        <tr>
                            <td>React</td>
                            <td>20h</td>
                            <td>01/03/2026</td>
                            <td>10/03/2026</td>
                        </tr>

                        <tr>
                            <td>Laravel</td>
                            <td>18h</td>
                            <td>12/03/2026</td>
                            <td>20/03/2026</td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </main>
    )
}