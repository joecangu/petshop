// CSS
import styles from "./Profile.module.css";

// COMPONENTS
import Navbar from '../../components/Navbar';
import Title from "../../components/Title";

import { toast } from 'react-toastify';
import { useContext, useState } from "react";
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/profile/avatar.png';
import { AuthContext } from '../../contexts/auth';

// BANCO DE DADOS
import { db, storage } from "../../services/firebaseConnection";
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile(){  

    const { user, setUser, storageUser } = useContext(AuthContext); 
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                toast.error("Tipo de arquivo inválido!");
                setImageAvatar(null);
                return;
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then( async(downloadURL) => {
                let urlFoto = downloadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }
    
                    setUser(data);
                    storageUser(data);
                    toast.success("Perfil atualizado com sucesso!");

                })
            })
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        
        if(imageAvatar === null && nome !== ''){
            // Atulizar apenas o nome do usuário
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome,
                }

                setUser(data);
                storageUser(data);
                toast.success("Perfil atualizado com sucesso!");
            })
        } else if( nome !== '' && imageAvatar !== null){
            // Atualizar nome e foto
            handleUpload();
        }
    }

    return(
        <div>
            <Navbar/>

            <Title titulo="Meu Perfil">
                <FiSettings size={25}/>
            </Title>
            
            <div className={styles.profile}>
                <form onSubmit={handleSubmit}>
                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload color="#FFF" size={25}/>
                        </span>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFile}
                        /> <br/>

                        {avatarUrl === null ?  (
                            <img src={avatar} alt="Foto de Perfil" width={250} height={250} />
                        ) : (
                            <img src={avatarUrl} alt="Foto de Perfil" width={250} height={250} />
                        )}
                    </label>
                    <label>
                        <span>Nome:</span>
                        <input 
                            type="text" 
                            name="nome" 
                            required 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>

                    <label>
                        <span>E-mail:</span>
                        <input 
                            type="email" 
                            name="email" 
                            value={email}
                            disabled={true}
                        />
                    </label>
                    <button className="btn">Salvar</button>
                </form>


            </div>
            
        </div>
    )
}