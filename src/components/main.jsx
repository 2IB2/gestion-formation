export default function Main(){
    return(
        <main className='main position-fixed w-75 p-4' style={{
            top: "40px",
            right: "100px",
            height: "calc(100vh - 100px)"
        }}>
                <h1 className='text-center pt-5'>Welcome to the Dashboard</h1>
                <div className="bbor d-flex  justify-content-around mt-5">
                    <div className="bor border p-4 m-3 shadow rounded">
                        <h4>Formation</h4>
                        <img src="" alt="formation.icon"/>
                        <p>nombre des formations: </p>
                    </div>
                    <div className="bor border p-4 m-3 shadow rounded ">
                        <h4>Formateur</h4>
                        <img src="" alt="formateur.icon"/>
                        <p className=''>nombre des formateurs: </p>
                    </div>
                    <div className="bor border p-4 m-3 shadow rounded">
                        <h4>Formation</h4>
                        <img src="" alt="formation.icon"/>
                        <p>total des formations active: </p>
                    </div>
                </div>
        </main>
    )
}