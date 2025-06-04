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
import {AuthRoute, PrivateRouteChildren, PrivateRouteParent, PublicRoute} from './components/PrivateRoute.tsx';
import HomeParent from "./pages/loggedParent/home/HomeParent.tsx";
import HomeChildren from "./pages/loggedChildren/home/HomeChildren.tsx";
import Login from "./pages/Login/Login.tsx";
import {WalletProvider} from "./context/WalletContext.tsx";
import ParentHistory from "./pages/loggedParent/history/ParentHistory.tsx";




const App: React.FC = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <WalletProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/" element={<Home />} />

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
                                <PrivateRouteParent>
                                    <HomeParent />
                                </PrivateRouteParent>
                            } />
                            <Route path="/parentHistory" element={
                                <PrivateRouteParent>
                                    <ParentHistory></ParentHistory>
                                </PrivateRouteParent>
                            }></Route>


                            <Route path="/homeChildren" element={
                                <PrivateRouteChildren>
                                    <HomeChildren />
                                </PrivateRouteChildren>
                            } />

                        </Routes>






                    </BrowserRouter>
                </ThemeProvider>
                </WalletProvider>
            </AuthProvider>
        </React.StrictMode>
    )
}

export default App