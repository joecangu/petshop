// CSS
import styles from "./ClientesPet.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

// ÍCONES
import { FiUser, FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa6';

// REACT
import { useEffect, useState, useMemo } from "react";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";

// DATATABLE
import DataTable from 'react-data-table-component';


// MENSAGEM
import { toast } from 'react-toastify';

// CONEXAO COM A TABELA
const listRef = collection(db, "clientes");

export default function ClientesPet(){

    const [clientes, setClientes] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [nome, setNome] = useState('');

    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        async function loadClientes(){
            const q = query(listRef, orderBy('nome'));

            const querySnapshot = await getDocs(q);
            setClientes([]);
            await carregarClientes(querySnapshot);
        }
        
        loadClientes();

        return () => { }
    }, []);

    async function carregarClientes(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    celular: doc.data().celular,
                    telefone: doc.data().telefone,
                    cep: doc.data().cep,
                    endereco: doc.data().endereco,
                    numero: doc.data().numero,
                    complemento: doc.data().complemento
                });
            });

            setClientes(clientes => [...clientes, ...lista]);
            setLoading(false);
        }else{
            setIsEmpty(true);
        }
    }
 

    // COLUNAS DO DATATABLE
    const columns = [
        {
            name: 'Nome',
            selector: row => row.nome,
        },
        {
            name: 'Endereço',
            selector: row => row.endereco + ' ' + row.numero,
        },
        {
            cell:(row) => <div style={{ marginTop: '1px', justifyContent:"space-around" }}>
                            <button style={{backgroundColor:'#3583f3', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px',}} id={row.nome}
                                // onClick={ () => handleDetail(row) }
                            >
                                <FiSearch style={{ marginTop: '2px'}} color='#FFF' size={17} />
                            </button>
                            <button style={{backgroundColor:'#f6a935', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px', marginBottom: '2px'}} id={row.nome}
                                // onClick={ () => handleEdit() }
                            >
                                <FiEdit2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                            </button>
                            <button style={{ backgroundColor: '#ff0000', borderRadius:'5px', padding: '2px 7px', border:'0', cursor:'pointer' }} id={row.nome}
                                // onClick={ () => handleDelete(row) }
                            >
                                <FiTrash2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                            </button>
                        </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          },
        
    ];

    
    return(
        <div>
            <Navbar/>
            <Title titulo="Pets do Cliente">
                <FaDog size={25}/>
            </Title>
            {loading ? 
                <div className={styles.clientes}>
                    <Loader/>
                </div>
                : 
                <>
                <div className={styles.clientes}>
                   
                
                </div>
                </>
            }

            
           
        </div>
        
    )
}