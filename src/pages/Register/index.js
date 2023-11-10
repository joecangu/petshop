// CSS
import styles from "./Register.module.css";

import { useState, useContext  } from "react";
import { AuthContext } from '../../contexts/auth';

import { toast } from 'react-toastify';

export default function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { signUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if(password !== confirmPassword) {
            toast.error("As senhas estão diferentes!")
            return;
        }
        
        if(name !== '' && email !== '' && password !== '' && confirmPassword !== ''){
            await signUp(email, password, name)
        }

    }

    return(
        <div className={styles.register}>
            <h1>Cadastrar</h1>
            <p>Crie seu usuário</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Nome:</span>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Nome do usuário"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
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
                <label>
                    <span>Confirmação de Senha:</span>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        required 
                        placeholder="Confirme a sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                
                {!loadingAuth && <button className="btn">Cadastrar</button>}
                {loadingAuth && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
            </form>
        </div> 
    )
}