import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss'
import Navbar from "./components/navbar/Navbar.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Corregido el import
import Signup from "./pages/signup/Signup.tsx"
import Home from "./pages/home/Home.tsx";
import "./theme.css"
import { ThemeProvider } from './ThemeContext';
import React from "react";
import ChildrenSign from "./pages/signup/children/ChildrenSign.tsx";
import AdultSign from "./pages/signup/adults/AdultSign.tsx";
import AuthCode from "./pages/Authcode/AuthCode.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {AuthRoute, PrivateRoute, PublicRoute} from './components/PrivateRoute.tsx';
import HomeParent from "./pages/loggedParent/home/HomeParent.tsx";
import HomeChildren from "./pages/loggedChildren/home/HomeChildren.tsx";
import Login from "./pages/Login/Login.tsx";
import EditarPerfilPadre from "./pages/editarP/EditarPerfilPadre.tsx";
import EditarPerfilHijo from "./pages/editarH/EditarPerfilHijo.tsx";
import EditarPerfilHijoDemo from "./pages/EditarPerfilHijoDemo.tsx";





const App: React.FC = () => {
    return (
        <React.StrictMode>
            <AuthProvider>

                <ThemeProvider>
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/" element={<Home />} />

                            <Route path="/editar-perfil-hijo-demo" element={<EditarPerfilHijoDemo />} />

                            {/* Rutas solo para usuarios no autenticados */}
                            <Route path="/signup" element={
                                <PublicRoute>
                                    <Signup />
                                </PublicRoute>
                            } />
                            <Route path="/childrenSignUp" element={
                                <PublicRoute>
                                    <ChildrenSign />
                                </PublicRoute>
                            } />
                            <Route path="/adultSignUp" element={
                                <PublicRoute>
                                    <AdultSign />
                                </PublicRoute>
                            } />
                            <Route path="/login" element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } />

                            {/* para auth porque es raro de verificar */}
                            <Route path="/authCode" element={
                                <AuthRoute>
                                    <AuthCode />
                                </AuthRoute>
                            } />

                            {/* Otras rutas privadas */}
                            <Route path="/homeParent" element={
                                <PrivateRoute>
                                    <HomeParent />
                                </PrivateRoute>
                            } />
                            <Route path="/homeChildren" element={
                                <PrivateRoute>
                                    <HomeChildren />
                                </PrivateRoute>
                            } />

                            <Route path="/EditarPerfilPadre" element={
                                <PrivateRoute>
                                    <EditarPerfilPadre />
                                </PrivateRoute>
                            } />

                            <Route path="/EditarPerfilHijo" element={
                                <PrivateRoute>
                                    <EditarPerfilHijo />
                                </PrivateRoute>
                            } />


                        </Routes>

                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    )
}

export default App
