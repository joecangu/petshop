// CSS
import styles from "./Clientes.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";


// ROTAS
import { Link } from "react-router-dom";

// ÍCONES
import { FiUser, FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa6';

// REACT
import { useEffect, useState, useMemo } from "react";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, getDocs, orderBy, limit, startAfter, query, deleteDoc, doc, updateDoc } from "firebase/firestore";

// DATATABLE
import DataTable from 'react-data-table-component';
import FilterComponent from 'react-data-table-component';

// TOOLTIP
import { Tooltip } from 'react-tooltip';

// MASCARA
import InputMask from "react-input-mask";

// MENSAGEM
import { toast } from 'react-toastify';

// CONEXAO COM A TABELA
const listRef = collection(db, "clientes");

export default function Clientes(){

    const [clientes, setClientes] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [nome, setNome] = useState('');
    const [nomeEdit, setNomeEdit] = useState('');
    const [celular, setCelular] = useState('');
    const [celularEdit, setCelularEdit] = useState('');
    const [telefone, setTelefone] = useState('');
    const [telefoneEdit, setTelefoneEdit] = useState('');
    const [endereco, setEndereco] = useState('');
    const [enderecoEdit, setEnderecoEdit] = useState('');
    const [cep, setCep] = useState('');
    const [cepEdit, setCepEdit] = useState('');
    const [numero, setNumero] = useState('');
    const [numeroEdit, setNumeroEdit] = useState('');
    const [complemento, setComplemento] = useState('');
    const [complementoEdit, setComplementoEdit] = useState('');
    const [idCliente, setIdCliente] = useState(null);

    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const [filteredItems, setFilteredItems] = useState([]);

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
 
    function handleFilter(){
        const filteredItems = clientes.filter(
            item => item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase()),
        );
        setFilteredItems(filteredItems);
    }

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		// return (
		// 	<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		// );
	}, [filterText, resetPaginationToggle]);

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
            name: 'Opções',
            cell:(row) => <div style={{ marginTop: '1px', justifyContent:"space-around" }}>
                            <a data-tooltip-id={row.id} data-tooltip-content="Detalhes">
                                <button style={{backgroundColor:'#3583f3', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px',}} id={row.nome}
                                    onClick={ () => handleDetail(row) }
                                >
                                    <FiSearch style={{ marginTop: '2px'}} color='#FFF' size={17} />
                                </button>
                            </a>
                            <a data-tooltip-id={row.id} data-tooltip-content="Editar">
                                <button style={{backgroundColor:'#f6a935', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer', marginRight: '2px', marginBottom: '2px'}} id={row.nome}
                                    onClick={ () => handleEdit(row) }
                                >
                                    <FiEdit2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                                </button>
                            </a>
                            <a data-tooltip-id={row.id} data-tooltip-content="Pets">
                                <Link to={`/clientes-pet/${row.id}`}>
                                    <button style={{backgroundColor:'#1a8918', borderRadius:'5px', padding:'2px 7px', border:'0', cursor:'pointer'}} id={row.nome}>
                                        <FaDog style={{ marginTop: '2px'}} color='#FFF' size={17} />
                                    </button>
                                </Link>
                            </a>
                            <a data-tooltip-id={row.id} data-tooltip-content="Excluir">
                                <button style={{ backgroundColor: '#ff0000', borderRadius:'5px', padding: '2px 7px', border:'0', cursor:'pointer' }} id={row.nome}
                                    onClick={ () => handleDelete(row) }
                                >
                                    <FiTrash2 style={{ marginTop: '2px'}} color='#FFF' size={17} />
                                </button>
                            </a>
                            <Tooltip id={row.id} />
                        </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          },
        
    ];

    const [modal, setModal] = useState(false);
    const [modalDetail, setModalDetail] = useState(false);
    const [detail, setDetail] = useState(null);

    const [modalDelete, setModalDelete] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    function toggleModal(){
        setModal(!modal);
        setEditar('');
        setNome('');
        setCelular('');
        setTelefone('');
        setEndereco('');
        setCep('');
        setNumero('');
        setComplemento('');
        setIdCliente(null);
    }

    function handleDetail(item){
        setDetail(item);
        setModalDetail(!modalDetail);
    }

    const [editar, setEditar] = useState(null)
    function handleEdit(item){
        setModal(!modal);
        setEditar(item);
        setNomeEdit(item.nome);
        setCelularEdit(item.celular);
        setTelefoneEdit(item.telefone);
        setEnderecoEdit(item.endereco);
        setCepEdit(item.cep);
        setNumeroEdit(item.numero);
        setComplementoEdit(item.complemento);
        setIdCliente(item.id);
    }

    function handleDelete(item){
        setDeleteData(item);
        setModalDelete(!modalDelete);
    }

    //FUNÇÃO DE ADICIONAR
    async function handleSubmit(e){
        e.preventDefault();

        let lista = [];

        let insert = {
            nome: nome,
            celular: celular,
            telefone: telefone,
            endereco: endereco,
            cep: cep,
            numero: numero,
            complemento: complemento
        };

        
        lista.push(insert);

        await addDoc(collection(db, "clientes"), insert)
        .then(() => {
            setClientes(clientes => [...clientes, ...lista]);
            toast.success("Cliente cadastrado com sucesso!");
            setNome('');
            setCelular('');
            setTelefone('');
            setEndereco('');
            setCep('');
            setNumero('');
            setComplemento('');
            setModal(false);
            
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
        })   
    }

    // FUNÇÃO DE ALTERAR
    async function handleUpdate(e){
        e.preventDefault();

        const docRef = doc(db, "clientes", idCliente);

        let update = {
            nome: nomeEdit,
            celular: celularEdit,
            telefone: telefoneEdit,
            endereco: enderecoEdit,
            cep: cepEdit,
            numero: numeroEdit,
            complemento: complementoEdit
        };
        
        await updateDoc(docRef, update)
        .then(async () => {

            setClientes([]);
            const queryUpdate = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryUpdate.forEach((doc) => {
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
            toast.success("Cliente alterado com sucesso!");
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

        await deleteDoc(doc(db, "clientes", deleteData.id))
        .then(async () =>{

            setClientes([]);
            const queryUpdate = await getDocs(query(listRef, orderBy('nome')));
            let lista = [];
            queryUpdate.forEach((doc) => {
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
            toast.success("Cliente removido com sucesso!");
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
            <Title titulo="Clientes">
                <FiUser size={25}/>
            </Title>
            {loading ? 
                <div className={styles.clientes}>
                    <Loader/>
                </div>
                : 
                <>
                <div className={styles.clientes}>
                    <button className="btn-new" onClick={toggleModal}>
                        <FiPlus color="#FFF" size={20}/>
                            Adicionar novo Cliente
                    </button>
                    
                    <DataTable
                        columns={columns}
                        data={clientes}
                        pagination
                        paginationResetDefaultPage={resetPaginationToggle} 
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                    />
                
                </div>
                </>
            }
            
            {/* MODAL DE ADICIONAR */}
            {modal &&
                <Modal 
                    titulo={editar ? "Editar Cliente" : "Adicionar novo Cliente"}
                    close={ () => setModal(!modal) }
                >
                    <form onSubmit={editar ? handleUpdate : handleSubmit}>                
                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Nome:</span>
                            <input 
                                type="text" 
                                name="nome" 
                                placeholder="Digite o seu nome"
                                required 
                                value={editar !== '' ? nomeEdit : nome}
                                onChange={
                                    (e) => {editar !== '' ? setNomeEdit(e.target.value) : setNome(e.target.value)}
                                }
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
                                value={editar !== '' ? celularEdit : celular}
                                onChange={
                                    (e) => {editar !== '' ? setCelularEdit(e.target.value) : setCelular(e.target.value)}
                                }
                            />
                        </label>
                        <label>
                            <span>Telefone:</span>
                            <InputMask 
                                mask="(99) 9999-9999" 
                                type="text" 
                                name="telefone" 
                                placeholder="Digite o seu telefone"
                                value={editar !== '' ? telefoneEdit : telefone}
                                onChange={
                                    (e) => {editar !== '' ? setTelefoneEdit(e.target.value) : setTelefone(e.target.value)}
                                }
                            />
                        </label>
                        <label>
                            <span>CEP:</span>
                            <input 
                                type="text" 
                                name="cep" 
                                placeholder="Digite o seu CEP"
                                value={editar !== '' ? cepEdit : cep}
                                onChange={
                                    (e) => {editar !== '' ? setCepEdit(e.target.value) : setCep(e.target.value)}
                                }
                            />
                        </label>
                        <label>
                            <span>Endereço:</span>
                            <input 
                                type="text" 
                                name="endereco" 
                                placeholder="Digite o seu endereço"
                                required 
                                value={editar !== '' ? enderecoEdit : endereco}
                                onChange={
                                    (e) => {editar !== '' ? setEnderecoEdit(e.target.value) : setEndereco(e.target.value)}
                                }
                            />
                        </label>
                        <label>
                            <span>Número:</span>
                            <input 
                                type="text" 
                                name="numero" 
                                placeholder="Digite o número"
                                required 
                                value={editar !== '' ? numeroEdit : numero}
                                onChange={
                                    (e) => {editar !== '' ? setNumeroEdit(e.target.value) : setNumero(e.target.value)}
                                }
                            />
                        </label>
                        <label>
                            <span>Complemento:</span>
                            <input 
                                type="text" 
                                name="complemento" 
                                placeholder="Digite o complemento"
                                value={editar !== '' ? complementoEdit : complemento}
                                onChange={
                                    (e) => {editar !== '' ? setComplementoEdit(e.target.value) : setComplemento(e.target.value)}
                                }
                            />
                        </label>

                        <button className="btn">{ editar ? 'Alterar' : 'Salvar'}</button>
                    </form>
                </Modal>
            }

            {modalDetail &&
                <Modal 
                    titulo="Detalhes do Cliente"
                    close={ () => setModalDetail(!modalDetail) }
                >
                    <form>   
                        <label>
                            <span>Nome: {detail.nome} </span>
                        </label>
                        <label>
                            <span>Endereço: {detail.endereco + ' N' + detail.numero} </span>
                        </label> 
                        <label  style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Celular: {detail.celular} </span>
                            <span>Celular: {detail.celular} </span>
                        </label> 
                        {detail.telefone && 
                            <>
                                <label>
                                    <span>Telefone: {detail.telefone} </span>
                                </label>  
                            </>
                        }
                    </form>
                </Modal>
            }

            {modalDelete &&
                <Modal 
                    titulo="Excluir Cliente"
                    close={ () => setModalDelete(!modalDelete) }
                >
                    <form onSubmit={handleDeleteData}>   
                        <label>
                            <p>Tem certeza que deseja excluir o cliente <b>{deleteData.nome} </b>? </p>
                        </label>

                        <button className="btn-delete">Excluir</button>
                    </form>
                </Modal>
            }
        </div>
        
    )
}