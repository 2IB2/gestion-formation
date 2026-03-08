export default function Header({username, onLogout}) {
    return(
        <header height="100px" className='d-flex justify-content-between align-items-center p-3 mb-4 fixed-top border-bottom bg-light shadow-sm'>
                <img src="./images/logo.png" width="100px" alt="Logo" />
                <h2>Dashboard</h2>
                <div className='d-flex align-items-end'>
                    <p className='h6'>Welcome, {username}!</p>
                    <button onClick={onLogout} className='btn btn-outline-danger'>
                        Logout
                    </button>
                </div>
        </header>
    )
}