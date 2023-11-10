// CSS
import styles from "./Login.module.css";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../../contexts/auth';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, loadingAuth } = useContext(AuthContext);

    async function handleLogin(e){
        e.preventDefault();

        if(email !== '' && password !== ''){
            await login(email, password);
        }
    }

    return(
        <div className={styles.login}>
            <h1>Login</h1>
            <p>Faça o login para poder utilizar o sistema!</p>
            <form onSubmit={handleLogin}>
                <label>
                    <span>E-mail:</span>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="E-mail do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <span>Senha:</span>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        placeholder="Senha do usuário"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>                
                {!loadingAuth && <button className="btn">Login</button>}
                {loadingAuth && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
            </form>
        </div> 
    )
}