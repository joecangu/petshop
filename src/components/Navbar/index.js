import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

// IMAGENS
import avatar from '../../assets/profile/avatar.png';

// CSS
import styles from './Navbar.module.css';

// ÍCONES
import { FiCalendar, FiUser, FiLogOut} from 'react-icons/fi';
import { FaDog, FaAngleDown, FaDollarSign, FaRegCircleUser } from 'react-icons/fa6';

// REACT
import { useState } from 'react';

export default function Navbar(){

    const { logout, user } = useContext(AuthContext);

    async function handleLogout(){
        await logout();
    }

    const [openPets, setOpenPets] = useState(false);
    const [openFinancial, setOpenFinancial] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    function handleOpenPets(){
        setOpenPets(!openPets);
        setOpenFinancial(false);
        setOpenProfile(false);
    }

    function handleOpenFinancial(){
        setOpenFinancial(!openFinancial);
        setOpenPets(false);
        setOpenProfile(false);
    }

    function handleOpenProfile(){
        setOpenProfile(!openProfile);
        setOpenPets(false);
        setOpenFinancial(false);
    }

    return(
        <nav className={styles.navbar}>
            <NavLink to="/dashboard" className={styles.brand}>
                PetShop <span> Studio Animali</span>
            </NavLink>
            <ul className={styles.links_list}>
                <li>
                    <div className={styles.dropdown}>
                    <button onClick={handleOpenFinancial} > <FaDollarSign style={{marginRight: '5px'}}/> Financeiro <FaAngleDown style={{marginLeft: '5px'}}/> </button>
                        {openFinancial ? (
                            <ul className={styles.menu}>
                                <li>
                                    <NavLink to="/contas-pagar" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaDollarSign/> Contas a Pagar
                                    </NavLink>
                                </li>
                            </ul>
                        ) : null }
                    </div>
                </li>
                <li>
                    <div className={styles.dropdown}>
                    <button onClick={handleOpenPets} > <FaDog style={{marginRight: '5px'}}/> Pets <FaAngleDown style={{marginLeft: '5px'}}/> </button>
                        {openPets ? (
                            <ul className={styles.menu}>
                                <li>
                                    <NavLink to="/pets" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaDog/> Pets
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/raca-pet" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaDog/> Raças do Pet
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/porte-pet" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaDog/> Portes do Pet
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/tipo-pet" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaDog/> Tipos do Pet
                                    </NavLink>
                                </li>
                            </ul>
                        ) : null }
                    </div>
                </li>
                <li>
                    <NavLink to="/clientes" className={({isActive}) => (isActive ? styles.active : '')}>
                        <FiUser/> Clientes
                    </NavLink>
                </li>
                
                
                
                <li>
                    <NavLink to="/dashboard" className={({isActive}) => (isActive ? styles.active : '')}>
                        <FiCalendar/> Agendamento
                    </NavLink>
                </li>
                

                <li>
                    <div className={styles.dropdown}>
                    <button onClick={handleOpenProfile} > 
                        {user.nome} <FaAngleDown style={{marginLeft: '5px'}}/> 
                    </button>
                        {openProfile ? (
                            <ul className={styles.menu}>
                                <li>
                                    <NavLink to="/profile" className={({isActive}) => (isActive ? styles.active : '')}>
                                        <FaRegCircleUser/> Perfil
                                    </NavLink>
                                </li>
                                <li>
                                    <button style={{ margin: '0 35%'}}onClick={handleLogout}>
                                        <FiLogOut/> Sair
                                    </button>
                                </li>
                            </ul>
                        ) : null }
                    </div>
                </li>
                
            </ul>
        </nav>
    )
}