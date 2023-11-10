// CSS
import styles from "./Clientes.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";

import { useState } from "react";

// ÍCONES
import { FiUser } from 'react-icons/fi';

// MASCARA
import InputMask from "react-input-mask";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection } from "firebase/firestore";

import { toast } from 'react-toastify';

export default function Clientes(){
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');


    // FUNÇÃO DE ADICIONAR
    async function handleSubmit(e){
        e.preventDefault();

        await addDoc(collection(db, "clientes"), {
            nome: nome,
            celular: celular,
            telefone: telefone,
            endereco: endereco,
            cep: cep,
            numero: numero,
            complemento: complemento
        })
        .then(() => {
            toast.success("Cliente cadastrado com sucesso!");
        })
        .catch((error) => {
            console.log("Error: ", error);
            toast.error("Ops! Aconteceu algum problema.");
        })   
    }
    
    return(
        <div>
            <Navbar/>
            <Title titulo="Clientes">
                <FiUser size={25}/>
            </Title>

            <div className={styles.clientes}>
                <form onSubmit={handleSubmit}>

                
                    <label>
                        <span>Nome:</span>
                        <input 
                            type="text" 
                            name="nome" 
                            placeholder="Digite o seu nome"
                            required 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Celular:</span>
                        <InputMask 
                            mask="(99) 99999-9999" 
                            type="text" 
                            name="celular" 
                            placeholder="Digite o seu celular"
                            required 
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Telefone:</span>
                        <InputMask 
                            mask="(99) 9999-9999" 
                            type="text" 
                            name="telefone" 
                            placeholder="Digite o seu telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>CEP:</span>
                        <input 
                            type="text" 
                            name="cep" 
                            placeholder="Digite o seu CEP"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Endereço:</span>
                        <input 
                            type="text" 
                            name="endereco" 
                            placeholder="Digite o seu endereço"
                            required 
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Número:</span>
                        <input 
                            type="text" 
                            name="numero" 
                            placeholder="Digite o número"
                            required 
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Complemento:</span>
                        <input 
                            type="text" 
                            name="complemento" 
                            placeholder="Digite o complemento"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />
                    </label>
                    
                    <button className="btn">Salvar</button>
                </form>


            </div>

        </div>
    )
}