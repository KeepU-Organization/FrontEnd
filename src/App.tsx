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

import EditarPerfilPadre from "./pages/editarP/EditarPerfilPadre.tsx";
import EditarPerfilHijo from "./pages/editarH/EditarPerfilHijo.tsx";
import EditarPerfilHijoDemo from "./pages/EditarPerfilHijoDemo.tsx";

import {WalletProvider} from "./context/WalletContext.tsx";
import ParentHistory from "./pages/loggedParent/history/ParentHistory.tsx";
import MonitorChildren from "./pages/loggedParent/monitorChildren/MonitorChildren.tsx";
import Store from "./pages/loggedChildren/store/Store.tsx";
import {StoreContextProvider} from "./context/StoreContext.tsx";
import {GiftCardContextProvider} from "./context/GIftCardsContext.tsx";
import ChildHistory from "./pages/loggedChildren/history/ChildHistory.tsx";
import {CoursesContextProvider} from "./context/CoursesContext.tsx";
import CourseSelection from "./pages/loggedChildren/academia/CourseSelection.tsx";
import CourseDetail from './pages/loggedChildren/academia/InCourse.tsx';
import {ModulesContextProvider} from "./context/ModulesContext.tsx";
import {ContentItemContextProvider} from "./context/ContentItemContext.tsx";





const App: React.FC = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <WalletProvider>
                    <StoreContextProvider>
                        <GiftCardContextProvider>
                            <CoursesContextProvider>
                                <ModulesContextProvider>
                                    <ContentItemContextProvider>

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
                                <PrivateRouteParent>
                                    <HomeParent />
                                </PrivateRouteParent>
                            } />
                            <Route path="/parentHistory" element={
                                <PrivateRouteParent>
                                    <ParentHistory></ParentHistory>
                                </PrivateRouteParent>
                            }></Route>

                            <Route path="/childMonitor" element={
                                <PrivateRouteParent>
                                    <MonitorChildren></MonitorChildren>
                                </PrivateRouteParent>
                            }></Route>



                            {/* Rutas privadas para hijos */}
                            <Route path="/homeChildren" element={
                                <PrivateRouteChildren>
                                    <HomeChildren />
                                </PrivateRouteChildren>
                            } />
                            <Route path="/store" element={
                                <PrivateRouteChildren>
                                    <Store />
                                </PrivateRouteChildren>
                            } />
                            <Route path="/childHistory" element={
                                <PrivateRouteChildren>
                                    <ChildHistory></ChildHistory>
                                </PrivateRouteChildren>
                            }></Route>
                            <Route path="/academia" element={
                                <PrivateRouteChildren>
                                    <CourseSelection></CourseSelection>
                                </PrivateRouteChildren>
                            }></Route>

                            <Route path="/course/:courseCode" element={
                                <PrivateRouteChildren>
                                    <CourseDetail></CourseDetail>
                                </PrivateRouteChildren>
                            }></Route>
                            {/* Ruta de autenticación */}

                            <Route path="/EditarPerfilPadre" element={
                                <PrivateRouteParent>
                                    <EditarPerfilPadre />
                                </PrivateRouteParent>
                            } />

                            <Route path="/EditarPerfilHijo" element={
                                <PrivateRouteChildren>
                                    <EditarPerfilHijo />
                                </PrivateRouteChildren>
                            } />


                        </Routes>

                    </BrowserRouter>
                </ThemeProvider>

                                    </ContentItemContextProvider>
                                </ModulesContextProvider>
                            </CoursesContextProvider>

                        </GiftCardContextProvider>
                    </StoreContextProvider>
                </WalletProvider>
            </AuthProvider>
        </React.StrictMode>
    )
}

export default App
