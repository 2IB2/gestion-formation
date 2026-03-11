import { useState } from "react";
import Formations from "./formations";
import Aside from "../components/aside";
import Header from "../components/header";
export default function ListeFormation({username,onLogout}){
    const [data,setData] = useState(
        [
            {
                nom:"back end",
                description :"loremzeedez",
                duree : 20,
                date_debut : "20/01/2020",
                date_fin : "20/04/2021",
            },
            {
                nom:"front end",
                description :"loremzeedez",
                duree : 18,
                date_debut : "20/05/2023",
                date_fin : "19/04/2025",
            }
        ]
    )

    const handelDelete = (index) => {
        setData(data.filter((_,ind)=>ind != index))
    }
    

    return(
        <>
            <Header onLogout={onLogout} username={username}/>
            <Aside/>
            {data.map((c,index)=>(
                <Formations formation={c} Supp={handelDelete(index)}/>
            ))}
        </>
    )
}