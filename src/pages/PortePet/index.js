// CSS
import styles from "./PortePet.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

// ÍCONES
import { FiUser, FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa6';

// REACT
import { useEffect, useState } from "react";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, getDocs, orderBy, query, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

// DATATABLE
import DataTable from 'react-data-table-component';

// MENSAGEM
import { toast } from 'react-toastify';

export default function PortePet(){

    const [isEmpty, setIsEmpty] = useState(false);

    const [portePet, setPortePet] = useState([]);
    const [nome, setNome] = useState('');
    const [nomeEdit, setNomeEdit] = useState('');
    const [idPortePet, setIdPortePet] = useState(null);

    const [loading, setLoading] = useState(true);

    // CONEXAO COM A TABELA
    const listRef = collection(db, "portepet");
    
    useEffect(() => {
        async function loadPortePets(){
            const q = query(listRef, orderBy('nome'));
            const querySnapshot = await getDocs(q);
            setPortePet([]);
            await carregarPortePets(querySnapshot);
        }
        
        loadPortePets();
        return () => { }
    }, []);

    async function carregarPortePets(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });

            setPortePet(portePet => [...portePet, ...lista]);
            setLoading(false);
        }else{
            setIsEmpty(true);
        }
    }
 
    // COLUNAS DO DATATABLE
    const columns = [
        {
            name: 'Porte do Pet',
            selector: row => row.nome,
        },
        {
            cell:(row) => <div style={{ marginTop: '1px', justifyContent:"space-around" }}>
                            <button style={{backgroundColor:'#f6a935', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px', marginBottom: '2px'}} id={row.nome}
                                onClick={ () => handleEdit(row) }
                            >
                                <FiEdit2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                            </button>
                            <button style={{ backgroundColor: '#ff0000', borderRadius:'5px', padding: '2px 7px', border:'0', cursor:'pointer' }} id={row.nome}
                                onClick={ () => handleDelete(row) }
                            >
                                <FiTrash2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                            </button>
                        </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          },
        
    ];

    const [modalDelete, setModalDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    function handleDelete(item){
        setDeleteData(item);
        setModalDelete(!modalDelete);
    }

    const [modal, setModal] = useState(false);
    function toggleModal(){
        setEditar('');
        setModal(!modal);
        setIdPortePet(null);
    }

    //FUNÇÃO DE ADICIONAR
    async function handleSubmit(e){
        e.preventDefault();

        let lista = [];

        let insert = {
            nome: nome,
        };

        lista.push(insert);

        await addDoc(collection(db, "portepet"), insert)
        .then(() => {
            setPortePet(portePet => [...portePet, ...lista]);
            toast.success("Porte do Pet cadastrado com sucesso!");
            setNome('');
            setModal(false);
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
        })   
    }

    const [editar, setEditar] = useState(null)
    function handleEdit(item){
        console.log('item', item);
        setModal(!modal);
        setEditar(item);
        setNomeEdit(item.nome);
        setIdPortePet(item.id);
    }

    // FUNÇÃO DE ALTERAR
    async function handleUpdate(e){
        e.preventDefault();

        const docRef = doc(db, "portepet", idPortePet);

        let update = {
            nome: nomeEdit,
        };
        
        await updateDoc(docRef, update)
        .then(async () => {

            setPortePet([]);
            const queryUpdate = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryUpdate.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome
                });
            });

            setPortePet(portePet => [...portePet, ...lista]);
            toast.success("Porte do Pet alterado com sucesso!");
            setModal(false);
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
        })
    }

    // FUNÇÃO DE DELETAR
    async function handleDeleteData(e){
        e.preventDefault();

        await deleteDoc(doc(db, "portepet", deleteData.id))
        .then(async () =>{

            setPortePet([]);
            const queryDelete = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryDelete.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });

            setPortePet(portePet => [...portePet, ...lista]);
            toast.success("Porte do Pet removido com sucesso!");
            setModalDelete(false);
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
            return;
        })
    }

    return(
        <div>
            <Navbar/>
            {loading ? 
                <div className={styles.portepet}>
                    <Loader/>
                </div>
                : 
                <>

                <Title titulo='Porte do Pet'>
                    <FaDog size={25}/>
                </Title>
                <div className={styles.portepet}>
                    <button className="btn-new" onClick={toggleModal}>
                        <FiPlus color="#FFF" size={20}/>
                            Adicionar novo Porte do Pet
                    </button>

                    <DataTable
                        columns={columns}
                        data={portePet}
                        pagination
                    />

                </div>
                </>
            }

            {/* MODAL DE ADICIONAR */}
            {modal &&
                <Modal 
                    titulo={editar !== '' ? "Alterar Tipo de Pet" :"Adicionar novo Tipo de Pet"}
                    close={ () => setModal(!modal) }
                >
                    <form onSubmit={editar !== '' ? handleUpdate : handleSubmit}>  
                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Nome:</span>
                            <input 
                                type="text" 
                                name="nome" 
                                placeholder="Digite o Porte do Pet"
                                required 
                                value={editar !== '' ? nomeEdit : nome}
                                onChange={
                                    (e) => {editar !== '' ? setNomeEdit(e.target.value) : setNome(e.target.value)}
                                }
                            />
                        </label>
                        <button style={{marginTop: '15%'}} className="btn">{editar !== '' ? 'Alterar' : 'Salvar'}</button>
                    </form>
                </Modal>
            }
            {modalDelete &&
                <Modal 
                    titulo="Excluir Porte de Pet"
                    close={ () => setModalDelete(!modalDelete) }
                >
                    <form onSubmit={handleDeleteData}>   
                        <label>
                            <p>Tem certeza que deseja excluir o porte <b>{deleteData.nome} </b>? </p>
                        </label>
                        <button className="btn-delete">Excluir</button>
                    </form>
                </Modal>
            }
        </div>     
    )
}