import { Routes, Route } from "react-router-dom";

import Private from "./Private";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Clientes from "../pages/Clientes";
import ClientesPet from "../pages/Clientes/clientes-pet";
import TipoPet from "../pages/TipoPet";
import PortePet from "../pages/PortePet";
import RacaPet from "../pages/RacaPet";

function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={ <Login/> } />
            <Route path="/register" element={ <Register/> } />
            <Route 
                path="/dashboard" 
                element={ 
                    <Private> 
                        <Dashboard/> 
                    </Private> 
                } 
            />
            <Route 
                path="/profile" 
                element={ 
                    <Private> 
                        <Profile/> 
                    </Private> 
                } 
            />
            <Route 
                path="/clientes" 
                element={ 
                    <Private> 
                        <Clientes/> 
                    </Private> 
                } 
            />
            <Route 
                path="/clientes-pet/:id" 
                element={ 
                    <Private> 
                        <ClientesPet/> 
                    </Private> 
                } 
            />
            <Route 
                path="/tipo-pet" 
                element={ 
                    <Private> 
                        <TipoPet/> 
                    </Private> 
                } 
            />
            <Route 
                path="/porte-pet" 
                element={ 
                    <Private> 
                        <PortePet/> 
                    </Private> 
                } 
            />
            <Route 
                path="/raca-pet" 
                element={ 
                    <Private> 
                        <RacaPet/> 
                    </Private> 
                } 
            />
        </Routes>
    )
}

export default RoutesApp;