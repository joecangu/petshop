// CSS
import styles from "./RacaPet.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

// ÍCONES
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa6';

// REACT
import { useEffect, useState } from "react";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";

// DATATABLE
import DataTable from 'react-data-table-component';

// MENSAGEM
import { toast } from 'react-toastify';

export default function RacaPet(){

    const [isEmpty, setIsEmpty] = useState(false);

    const [racaPet, setRacaPet] = useState([]);
    const [nome, setNome] = useState('');
    const [nomeEdit, setNomeEdit] = useState('');
    const [idRacaPet, setIdRacaPet] = useState(null);

    const [loading, setLoading] = useState(true);

    // CONEXAO COM A TABELA
    const listRef = collection(db, "racapet");
    
    useEffect(() => {
        async function loadRacaPets(){
            const q = query(listRef, orderBy('nome'));
            const querySnapshot = await getDocs(q);
            setRacaPet([]);
            await carregarRacaPets(querySnapshot);
        }
        
        loadRacaPets();
        return () => { }
    }, []);

    async function carregarRacaPets(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });

            setRacaPet(racaPet => [...racaPet, ...lista]);
            setLoading(false);
        }else{
            setIsEmpty(true);
        }
    }
 
    // COLUNAS DO DATATABLE
    const columns = [
        {
            name: 'Raça do Pet',
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
        setIdRacaPet(null);
    }

    //FUNÇÃO DE ADICIONAR
    async function handleSubmit(e){
        e.preventDefault();

        let lista = [];

        let insert = {
            nome: nome,
        };

        lista.push(insert);

        await addDoc(collection(db, "racapet"), insert)
        .then(() => {
            setRacaPet(racaPet => [...racaPet, ...lista]);
            toast.success("Raça do Pet cadastrado com sucesso!");
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
        setIdRacaPet(item.id);
    }

    // FUNÇÃO DE ALTERAR
    async function handleUpdate(e){
        e.preventDefault();

        const docRef = doc(db, "racapet", idRacaPet);

        let update = {
            nome: nomeEdit,
        };
        
        await updateDoc(docRef, update)
        .then(async () => {

            setRacaPet([]);
            const queryUpdate = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryUpdate.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome
                });
            });

            setRacaPet(racaPet => [...racaPet, ...lista]);
            toast.success("Raça do Pet alterado com sucesso!");
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

        await deleteDoc(doc(db, "racapet", deleteData.id))
        .then(async () =>{

            setRacaPet([]);
            const queryDelete = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryDelete.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });

            setRacaPet(racaPet => [...racaPet, ...lista]);
            toast.success("Raça do Pet removido com sucesso!");
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
                <div className={styles.racapet}>
                    <Loader/>
                </div>
                : 
                <>

                <Title titulo='Raças de Pet'>
                    <FaDog size={25}/>
                </Title>
                <div className={styles.racapet}>
                    <button className="btn-new" onClick={toggleModal}>
                        <FiPlus color="#FFF" size={20}/>
                            Adicionar nova Raça do Pet
                    </button>

                    <DataTable
                        columns={columns}
                        data={racaPet}
                        pagination
                    />

                </div>
                </>
            }

            {/* MODAL DE ADICIONAR */}
            {modal &&
                <Modal 
                    titulo={editar !== '' ? "Alterar Raça do Pet" :"Adicionar nova Raça de Pet"}
                    close={ () => setModal(!modal) }
                >
                    <form onSubmit={editar !== '' ? handleUpdate : handleSubmit}>  
                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Nome:</span>
                            <input 
                                type="text" 
                                name="nome" 
                                placeholder="Digite a Raça do Pet"
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
                    titulo="Excluir Raça do Pet"
                    close={ () => setModalDelete(!modalDelete) }
                >
                    <form onSubmit={handleDeleteData}>   
                        <label>
                            <p>Tem certeza que deseja excluir a raça <b>{deleteData.nome} </b>? </p>
                        </label>
                        <button className="btn-delete">Excluir</button>
                    </form>
                </Modal>
            }
        </div>     
    )
}