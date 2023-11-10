// CSS
import styles from './Sidebar.module.css';


import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings} from 'react-icons/fi';

import avatarImg from '../../assets/profile/avatar.png';


export default function Header(){
    const { user } = useContext(AuthContext);

    return(
        <div className={styles.sidebar}>
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário"/>
            </div>

            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
                Chamados
            </Link>
            <Link to="/tutores">
                <FiUser color="#FFF" size={24} />
                Tutores
            </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
                Perfil
            </Link>
        </div>
    )
}