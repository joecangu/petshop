// CSS
import styles from "./Clientes.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

// ÍCONES
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa6';

// REACT
import { useEffect, useState } from "react";

// BANCO DE DADOS
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, getDocs, orderBy, query, deleteDoc, doc, getDoc, where } from "firebase/firestore";

// DATATABLE
import DataTable from 'react-data-table-component';

// ROTAS
import { useParams, Link } from "react-router-dom";

// DATEPICKER
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import br from 'date-fns/locale/pt-BR';

// MENSAGEM
import { toast } from 'react-toastify';
import { IconContext } from "react-icons";

export default function ClientesPet(){

    // ID DO CLIENTE
    const { id } = useParams();

    const [cliente, setCliente] = useState('');
    const [pets, setPets] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [observacao, setObservacao] = useState('');

    // VARIAVEL DATEPICKER
    const [selectedDate, setSelectedDate] = useState(null);

    const [loading, setLoading] = useState(true);

    
    
    // FUNÇÃO PARA CONSULTAR O CLIENTE DO PET
    async function clientePet(){
        setCliente([]);
        const docRef = doc(db, "clientes", id);
        await getDoc(docRef)
        .then((snapshot) => {
            setCliente(snapshot.data());
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
        })
    }   

    // CONEXAO COM A TABELA
    const listRef = collection(db, "pets");
    
    // CONSULTAR OS PETS DO CLIENTE
    useEffect(() => {
        async function loadPets(){
            const q = query(listRef, where("id_cliente", "==", id));
            const querySnapshot = await getDocs(q);
            setPets([]);
            await carregarPets(querySnapshot);
        }
        
        loadPets();
        clientePet();

        return () => { }
    }, []);

    async function carregarPets(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    nome_cliente: doc.data().nome_cliente,
                    observacao: doc.data().observacao,
                    porte: doc.data().porte,
                    tipo: doc.data().tipo,
                    raca: doc.data().raca,
                    data_nascimento: doc.data().data_nascimento
                });
            });

            setPets(pets => [...pets, ...lista]);
            setLoading(false);
        }else{
            setIsEmpty(true);
            setLoading(false);
        }
    }

    console.log('pets', pets);
 
    // COLUNAS DO DATATABLE
    const columns = [
        {
            name: 'Pet',
            selector: row => row.nome,
        },
        {
            name: 'Raça',
            selector: row => row.raca,
        },
        {
            name: 'Data de Nascimento',
            selector: row => row.data_nascimento,
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

    const [modal, setModal] = useState(false);
    function toggleModal(){
        setModal(!modal);
    }

    // VARIAVEIS DO INPUT E AUTOCOMPLETE
    const [inputSearch, setInputSearch] = useState('');
    const [filterSearch, setFilterSearch] = useState([]);

    const [inputSearchPortePet, setInputSearchPortePet] = useState('');
    const [filterSearchPortePet, setFilterSearchPortePet] = useState([]);

    const [inputSearchTipoPet, setInputSearchTipoPet] = useState('');
    const [filterSearchTipoPet, setFilterSearchTipoPet] = useState([]);

    // VARIAVEIS PARA ARMAZENAR OS VALORES DA CONSULTA DO USEEFFECT
    const [racaPet, setRacaPet] = useState([]);
    const [idRacaPet, setIdRacaPet] = useState(null);

    const [portePet, setPortePet] = useState([]);
    const [idPortePet, setIdPortePet] = useState(null);

    const [tipoPet, setTipoPet] = useState([]);
    const [idTipoPet, setIdTipoPet] = useState(null);

    // CONEXAO COM A TABELA DE RAÇAS DE PET
    const listRefRacaPet = collection(db, "racapet");
    const listRefPortePet = collection(db, "portepet");
    const listRefTipoPet = collection(db, "tipopet");

    // RENDERIZA O COMPONENTE QUANDO ENTRA NA TELA
    useEffect(() => {
        // AUTOCOMPLETE
        async function consultarRacaPet(){
            setRacaPet([]);
            const queryRacaPet = await getDocs(query(listRefRacaPet, orderBy('nome')));
            let listaRacaPet = [];
            queryRacaPet.forEach((doc) => {
                listaRacaPet.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });
            setRacaPet(racaPet => [...racaPet, ...listaRacaPet]);
        }

        async function consultarPortePet(){
            setPortePet([]);
            const queryPortePet = await getDocs(query(listRefPortePet, orderBy('nome')));
            let listaPortePet = [];
            queryPortePet.forEach((doc) => {
                listaPortePet.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });
            setPortePet(portePet => [...portePet, ...listaPortePet]);
        }

        async function consultarTipoPet(){
            setTipoPet([]);
            const queryTipoPet = await getDocs(query(listRefTipoPet, orderBy('nome')));
            let listaTipoPet = [];
            queryTipoPet.forEach((doc) => {
                listaTipoPet.push({
                    id: doc.id,
                    nome: doc.data().nome,
                });
            });
            setTipoPet(tipoPet => [...tipoPet, ...listaTipoPet]);
        }

        consultarRacaPet();
        consultarPortePet();
        consultarTipoPet();
    }, []);

    // FUNÇÃO PARA FILTRAR NO AUTOCOMPLETE
    function handleFilter(e){
        setInputSearch(e.target.value);

        const newFilter = racaPet.filter(value =>{
            return value.nome.toLowerCase().includes(inputSearch.toLowerCase())
        });

        setFilterSearch(newFilter);
    }

    // FUNÇÃO PARA FILTRAR NO AUTOCOMPLETE
    function handleFilterPortePet(e){
        setInputSearchPortePet(e.target.value);

        const newFilterPortePet = portePet.filter(value =>{
            return value.nome.toLowerCase().includes(inputSearchPortePet.toLowerCase())
        });

        setFilterSearchPortePet(newFilterPortePet);
    }

    // FUNÇÃO PARA FILTRAR NO AUTOCOMPLETE
    function handleFilterTipoPet(e){
        setInputSearchTipoPet(e.target.value);

        const newFilterTipoPet = tipoPet.filter(value =>{
            return value.nome.toLowerCase().includes(inputSearchTipoPet.toLowerCase())
        });

        setFilterSearchTipoPet(newFilterTipoPet);
    }

    //FUNÇÃO DE ATRIBUIÇÃO DO VALOR DO AUTOCOMPLETE NO INPUT
    function handleClickAutoComplete(value){

        // ATRIBUI O VALOR NOME AO INPUT
        setInputSearch(value.nome);
        
        // ATRIBUI O ID DO CLIENTE NA VARIAVEL IDCLIENTE
        setIdRacaPet(value.id);

        // VOLTA PARA O ESTADO NORMAL E DESAPARECE O AUTOCOMPLETE
        setFilterSearch([]);
    }

    //FUNÇÃO DE ATRIBUIÇÃO DO VALOR DO AUTOCOMPLETE NO INPUT
    function handleClickAutoCompletePortePet(value){

        // ATRIBUI O VALOR NOME AO INPUT
        setInputSearchPortePet(value.nome);
        
        // ATRIBUI O ID DO CLIENTE NA VARIAVEL IDCLIENTE
        setIdPortePet(value.id);

        // VOLTA PARA O ESTADO NORMAL E DESAPARECE O AUTOCOMPLETE
        setFilterSearchPortePet([]);
    }

    //FUNÇÃO DE ATRIBUIÇÃO DO VALOR DO AUTOCOMPLETE NO INPUT
    function handleClickAutoCompleteTipoPet(value){

        // ATRIBUI O VALOR NOME AO INPUT
        setInputSearchTipoPet(value.nome);
        
        // ATRIBUI O ID DO CLIENTE NA VARIAVEL IDCLIENTE
        setIdTipoPet(value.id);

        // VOLTA PARA O ESTADO NORMAL E DESAPARECE O AUTOCOMPLETE
        setFilterSearchTipoPet([]);
    }

    // LIMPA O INPUT DE PESQUISA E O AUTOCOMPLETE
    function clearInputSearch(){
        setInputSearch('')
        setFilterSearch([]);
        setIdRacaPet(null);
    }

    // LIMPA O INPUT DE PESQUISA E O AUTOCOMPLETE
    function clearInputSearchPortePet(){
        setInputSearchPortePet('')
        setFilterSearchPortePet([]);
        setIdPortePet(null);
    }

    // LIMPA O INPUT DE PESQUISA E O AUTOCOMPLETE
    function clearInputSearchTipoPet(){
        setInputSearchTipoPet('')
        setFilterSearchTipoPet([]);
        setIdTipoPet(null);
    }

    // FUNÇÃO AUXILIAR PARA DATA
    function dateFormatAux(date){
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' + d.getFullYear();

        if(month.length < 2)
            month = '0' + month;

        return [day, month, year].join('/');
    }

    // FUNÇÃO PARA FORMATAR DATA
    function dateFormat(date){

        setSelectedDate(date);

        let dataFormatada = dateFormatAux(date);
 
        setDataNascimento(dataFormatada);

        return [dataFormatada];
    }

    //FUNÇÃO DE ADICIONAR
    async function handleSubmit(e){
        e.preventDefault();

        let lista = [];

        let insert = {
            nome: nome,
            id_cliente: id,
            nome_cliente: cliente.nome,
            endereco: cliente.endereco,
            data_nascimento: dataNascimento,
            tipo: inputSearchTipoPet,
            tipo_id: idTipoPet,
            porte: inputSearchPortePet,
            porte_id: idPortePet,
            raca: inputSearch,
            raca_id:  idRacaPet,
            observacao: observacao
        };

        
        lista.push(insert);

        await addDoc(collection(db, "pets"), insert)
        .then(() => {
            setPets(pets => [...pets, ...lista]);
            toast.success("Pet cadastrado com sucesso!");
            setNome('');
            setDataNascimento('');
            setObservacao('');
            setInputSearch([]);
            setIdRacaPet(null);
            setInputSearchPortePet([]);
            setIdPortePet(null);
            setFilterSearchTipoPet([]);
            setIdTipoPet(null);
            setModal(false);
        })
        .catch((err) => {
            console.error("Ops! ocorreu um erro" + err);
            toast.error("Ops! Aconteceu algum problema.");
        })   
    }
 
    return(
        <div>
            <Navbar/>
            {loading ? 
                <div className={styles.clientes}>
                    <Loader/>
                </div>
                : 
                <>
                <Title titulo={ `Pets do ${cliente.nome}` }>
                    <FaDog size={25}/>
                </Title>
                <div className={styles.clientes}>
                    <button className="btn-new" onClick={toggleModal}>
                        <FiPlus color="#FFF" size={20}/>
                            Adicionar novo Pet
                    </button>

                    <DataTable
                        columns={columns}
                        data={pets}
                        pagination
                    />
                </div>
                <Link className="btn-back" to={'/clientes'}>
                    Voltar
                </Link>
                </>
            }

            {/* MODAL DE ADICIONAR */}
            {modal &&
                <Modal 
                    titulo={"Adicionar novo Cliente"}
                    close={ () => setModal(!modal) }
                >
                    <form onSubmit={handleSubmit}>  
                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Nome:</span>
                            <input 
                                type="text" 
                                name="nome" 
                                placeholder="Digite o nome do Pet"
                                required 
                                value={nome}
                                onChange={
                                    (e) => {setNome(e.target.value)}
                                }
                            />
                        </label>

                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Data Nascimento:</span>
                            <DatePicker 
                                style={{width: '100%'}}
                                selected={selectedDate}
                                onChange={date => dateFormat(date)}
                                placeholderText="Data do Nascimento"
                                dateFormat="dd/MM/yyyy"
                                locale={br}
                            />
                        </label>

                        <div className='row'>
                            <div>
                                <label>
                                    <span>Tipo do Pet:</span>
                                    <IconContext.Provider value={{ color: '#B8B8B8'}}>
                                        {/* {inputSearchTipoPet !== "" ? <FiSearch/> : ''} */}
                                        <input 
                                            style={{width: '630px', marginBottom:'0'}}
                                            type="text" 
                                            placeholder="Tipo do Pet"
                                            value={inputSearchTipoPet}
                                            onChange={handleFilterTipoPet}
                                        />
                                        {inputSearchTipoPet !== "" ? <FiX onClick={clearInputSearchTipoPet} size={20}/> : ''}
                                    </IconContext.Provider>
                                </label>
                            </div>
                            <div className={styles.dataResult}>
                                { filterSearchTipoPet.map(value => {
                                    return (
                                        <div className={styles.dataItem} key={value.id} onClick={() => handleClickAutoCompleteTipoPet(value)}>
                                            <p>{value.nome}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='row'>
                            <div className="searchInput">
                                <label>
                                    <span>Raça do Pet:</span>
                                    <IconContext.Provider value={{ color: '#B8B8B8'}}>
                                        {/* {inputSearch !== "" ? <FiSearch/> : ''} */}
                                        <input 
                                            style={{width: '630px', marginBottom:'0'}}
                                            type="text" 
                                            placeholder="Raça do Pet"
                                            value={inputSearch}
                                            onChange={handleFilter}
                                        />
                                        {inputSearch !== "" ? <FiX onClick={clearInputSearch} size={20}/> : ''}
                                    </IconContext.Provider>
                                </label>
                            </div>
                            <div className={styles.dataResult}>
                                { filterSearch.map(value => {
                                    return (
                                        <div className={styles.dataItem} key={value.id} onClick={() => handleClickAutoComplete(value)}>
                                            <p>{value.nome}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='row'>
                            <div>
                                <label>
                                    <span>Porte do Pet:</span>
                                    <IconContext.Provider value={{ color: '#B8B8B8'}}>
                                        {/* {inputSearchPortePet !== "" ? <FiSearch/> : ''} */}
                                        <input 
                                            style={{width: '630px', marginBottom:'0'}}
                                            type="text" 
                                            placeholder="Porte do Pet"
                                            value={inputSearchPortePet}
                                            onChange={handleFilterPortePet}
                                        />
                                        {inputSearchPortePet !== "" ? <FiX onClick={clearInputSearchPortePet} size={20}/> : ''}
                                    </IconContext.Provider>
                                </label>
                            </div>
                            <div className={styles.dataResult}>
                                { filterSearchPortePet.map(value => {
                                    return (
                                        <div className={styles.dataItem} key={value.id} onClick={() => handleClickAutoCompletePortePet(value)}>
                                            <p>{value.nome}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <label style={{display: 'flex', alignItems:'left'}}>
                            <span>Observacao :</span>
                            <input 
                                type="textarea" 
                                name="observacao" 
                                placeholder="Digite alguma observação sobre o Pet (opcional)" 
                                value={observacao}
                                onChange={
                                    (e) => {setObservacao(e.target.value)}
                                }
                            />
                        </label>                
                        
                        <button className="btn">{'Salvar'}</button>
                    </form>
                </Modal>
            }
        </div>
        
        
    )
}