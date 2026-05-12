import { useState, useId } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'
import axios from 'axios'
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const API_URL = "http://localhost:8000/api"

const DEMO_USERS = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "trainer", password: "trainer123", role: "formateur" },
    { username: "client", password: "client123", role: "client" }
]

export default function Login({ onLogin }) {
    const usernameId = useId()
    const passwordId = useId()
    const navigate = useNavigate()

    const [loginType, setLoginType] = useState("admin") // 'admin' or 'client'
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!username || !password) {
            setError("Veuillez remplir tous les champs")
            return
        }
        setError("")
        setLoading(true)

        try {
            const res = await axios.post(`${API_URL}/login`, {
                username, 
                password,
                type: loginType,
                table: loginType === 'client' ? 'utilisators' : 'users'
            })
            const user = res.data?.user || res.data
            if (!user) throw new Error("Invalid response")

            if (rememberMe) localStorage.setItem("user", JSON.stringify(user))
            onLogin(user)
            navigate('/dashboard')
        } catch (apiErr) {
            console.error("Login error:", apiErr);
            if (apiErr.response) {
                setError(apiErr.response.data?.message || "Identifiants invalides pour l'espace " + loginType);
            } else {
                setError("Erreur réseau: Impossible de se connecter au serveur. Est-il en cours d'exécution ?");
            }
            setPassword("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <img src={logo} className="login-logo" alt="Logo" />
                    </div>
                    <h1>
                        {loginType === 'admin' ? 'Espace Administrateur' : 
                         loginType === 'trainer' ? 'Espace Formateur' : 
                         'Accès Client'}
                    </h1>
                    <p>Entrez vos identifiants pour accéder à votre espace {loginType === 'admin' ? 'administrateur' : loginType === 'trainer' ? 'formateur' : 'client'}</p>
                </div>

                <div className="login-tabs">
                    <button 
                        className={`tab-btn ${loginType === 'admin' ? 'active' : ''}`}
                        onClick={() => { setLoginType('admin'); setError(""); }}
                    >
                        Espace Administrateur
                    </button>
                    <button 
                        className={`tab-btn ${loginType === 'trainer' ? 'active' : ''}`}
                        onClick={() => { setLoginType('trainer'); setError(""); }}
                    >
                        Espace Formateur
                    </button>
                    <button 
                        className={`tab-btn ${loginType === 'client' ? 'active' : ''}`}
                        onClick={() => { setLoginType('client'); setError(""); }}
                    >
                        Espace Client
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor={usernameId}>Nom d'utilisateur / Email</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input
                                id={usernameId}
                                type="text"
                                placeholder={
                                    loginType === 'admin' ? "ex. admin" : 
                                    loginType === 'trainer' ? "ex. formateur" : 
                                    "ex. client@exemple.com"
                                }
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor={passwordId}>Mot de passe</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <div className="password-input-wrapper">
                                <input
                                    id={passwordId}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            Se souvenir de moi
                        </label>
                        {loginType === 'client' && (
                            <a href="#" className="forgot-link">Mot de passe oublié ?</a>
                        )}
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button className="submit-btn" disabled={loading}>
                        {loading ? (
                            <div className="btn-loading">
                                <div className="btn-spinner"></div>
                                <span>Connexion...</span>
                            </div>
                        ) : (
                            <>
                                <LogIn size={18} style={{marginRight: '10px'}} />
                                <span>
                                    {loginType === 'admin' ? 'Connexion Administrateur' : 
                                     loginType === 'trainer' ? 'Connexion Formateur' : 
                                     'Connexion Client'}
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {loginType === 'client' && (
                    <div className="register-prompt">
                        Vous n'avez pas de compte ? <a href="#">Inscrivez-vous ici</a>
                    </div>
                )}
            </div>

            <style jsx="true">{`
                .login-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top right, #f8fafc 0%, #f1f5f9 100%);
                    padding: 24px;
                }
                .login-card {
                    background: white;
                    width: 100%;
                    max-width: 420px;
                    padding: 48px;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .logo-container {
                    width: 64px;
                    height: 64px;
                    background: #f8fafc;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    border: 1px solid var(--border-color);
                }
                .login-logo {
                    width: 40px;
                    height: auto;
                }
                .login-header h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #0f172a;
                    letter-spacing: -0.025em;
                }
                .login-header p {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                
                .login-tabs {
                    display: flex;
                    background: #f1f5f9;
                    padding: 4px;
                    border-radius: 10px;
                    margin-bottom: 32px;
                }
                .tab-btn {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    background: transparent;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 8px;
                }
                .tab-btn.active {
                    background: white;
                    color: var(--primary);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 12px;
                    color: #94a3b8;
                    pointer-events: none;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.9375rem;
                    transition: all 0.2s;
                    background: #fcfcfc;
                }
                .input-with-icon input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }
                
                .password-input-wrapper {
                    position: relative;
                    width: 100%;
                }
                .toggle-password {
                    position: absolute;
                    right: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .toggle-password:hover {
                    color: var(--primary);
                    background: #f1f5f9;
                }

                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .checkbox-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.875rem;
                    color: #64748b;
                    cursor: pointer;
                }
                .forgot-link {
                    font-size: 0.8125rem;
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }
                .forgot-link:hover { text-decoration: underline; }

                .submit-btn {
                    background: var(--primary);
                    color: white;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9375rem;
                    margin-top: 8px;
                    transition: all 0.2s;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .submit-btn:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
                }
                .submit-btn:disabled {
                    opacity: 0.8;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .btn-loading {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .btn-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .login-error {
                    background: #fef2f2;
                    color: #ef4444;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 0.8125rem;
                    border: 1px solid #fee2e2;
                    text-align: center;
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
                    40%, 60% { transform: translate3d(3px, 0, 0); }
                }
                
                .register-prompt {
                    margin-top: 32px;
                    text-align: center;
                    font-size: 0.875rem;
                    color: #64748b;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-color);
                }
                .register-prompt a {
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }
                .register-prompt a:hover { text-decoration: underline; }
            `}</style>
        </div>
    )
}