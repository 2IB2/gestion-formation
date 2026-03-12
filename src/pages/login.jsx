import { useState, useId } from "react"
import { useNavigate } from "react-router-dom"

const USERS = [
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
    

    function handleSubmit(e) {
        e.preventDefault()

        if (!username || !password) {
            setError("Please fill all fields")
            return
        }
    
        const user = USERS.find(
            (u) => u.username === username && u.password === password
        )

        if (!user) {
            setError("Invalid username or password")
            setPassword("")
            return
        }

        setError("")

        if(rememberMe)
            localStorage.setItem("user", JSON.stringify(user))

        onLogin(user)
        navigate('/dashboard')
    }

    return (
        <div className="login col-md-4 col-lg-3 mx-auto mt-5 border p-4 shadow">

            <img src="./images/logo.png" className="cover" alt="Logo" />
            <p className="text-center fs-3">Login</p>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label" htmlFor={usernameId}>
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
                    <label className="form-label" htmlFor={passwordId}>
                        Password
                    </label>

                    <div className="input-group ">

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
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label">
                        Remember me
                    </label>
                </div>

                {error && (
                    <div className="text-danger mb-3">
                        {error}
                    </div>
                )}

                <button className="btn btn-primary w-100">
                    Login
                </button>

            </form>
        </div>
    )
}