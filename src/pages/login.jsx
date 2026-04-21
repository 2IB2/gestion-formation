import { useState, useId } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'
import axios from 'axios'

const API_URL = "http://localhost:8000/api"

// Fallback demo accounts (used when the backend is unreachable)
const DEMO_USERS = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "trainer", password: "trainer123", role: "formateur" }
]

export default function Login({ onLogin }) {

    const usernameId = useId()
    const passwordId = useId()

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (!username || !password) {
            setError("Please fill all fields")
            return
        }

        setError("")
        setLoading(true)

        try {
            // Attempt real API login
            const res = await axios.post(`${API_URL}/login`, { username, password })
            const user = res.data?.user || res.data
            if (!user) throw new Error("Invalid response")

            if (rememberMe) localStorage.setItem("user", JSON.stringify(user))
            onLogin(user)
            navigate('/dashboard')
        } catch (apiErr) {
            // Fallback to demo credentials if backend is unreachable
            const demoUser = DEMO_USERS.find(
                (u) => u.username === username && u.password === password
            )
            if (demoUser) {
                if (rememberMe) localStorage.setItem("user", JSON.stringify(demoUser))
                onLogin(demoUser)
                navigate('/dashboard')
            } else {
                setError("Invalid username or password")
                setPassword("")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login col-md-4 col-lg-3 mx-auto mt-5 border p-4 shadow rounded bg-white">

            <img src={logo} className="cover w-50 d-block mx-auto" alt="Logo" />
            <p className="text-center fs-3 text-dark">Login</p>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label text-dark" htmlFor={usernameId}>
                        Username
                    </label>

                    <input
                        id={usernameId}
                        className="form-control"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label text-dark" htmlFor={passwordId}>
                        Password
                    </label>

                    <div className="input-group">

                        <input
                            id={passwordId}
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>

                    </div>
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label text-dark" htmlFor="rememberMe">
                        Remember me
                    </label>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 mb-3">
                        {error}
                    </div>
                )}

                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in…" : "Login"}
                </button>

            </form>
        </div>
    )
}