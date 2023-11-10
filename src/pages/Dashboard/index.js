// CSS
import styles from "./Dashboard.module.css";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar'


import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";

export default function Dashboard(){

    const { logout } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }
    
    return(
        <div>
            <Navbar/>
            {/* <Sidebar/> */}
            <h1> Dashboard </h1>
            <button onClick={handleLogout}>Sair</button>
        </div>
    )
}