import { useNavigate } from "react-router-dom"
import logo from '../assets/image.png'
export default function Header({username, onLogout}) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        onLogout();
        navigate("/");
    };
    return(
        <header height="100px" className='d-flex justify-content-between align-items-center p-3 mb-4 fixed-top border-bottom bg-light shadow-sm'>
                <img src={logo} className="cover" width="80px" alt="Logo" />
                <h2>Dashboard</h2>
                <div className='d-flex align-items-center gap-3'>
                    <p className='h6 mb-0'>Welcome, {username}!</p>
                    <button onClick={handleClick} className='btn btn-outline-danger'>
                        Logout
                    </button>
                </div>
        </header>
    )
}