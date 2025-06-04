import logo from '../../assets/logo.jpg'
import {Link, } from "react-router-dom";
import {GrayButton, YellowButton} from "../buttons/Buttons.tsx"
import "./Navbar.scss"
import {useTheme} from "../../ThemeContext.tsx";
import React from "react";
import Switch from "../buttons/Switch.tsx";
import {useAuth} from "../../hooks/UseAuth.tsx";

interface NavbarStyleProps {
    backgroundColor: string;
    transition: string;
}




const NavbarComponent:React.FC = () => {
    const { theme } = useTheme();
    const {user,isAuthenticated, isLoading,logout} = useAuth();
    console.log("Navbar renderizado con:", { user, isAuthenticated });

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }
    const handleLogout = () => {
        logout();
    };

    // Estilos condicionales basados en el tema
    const navbarStyle: NavbarStyleProps = {
        backgroundColor: theme === 'dark' ? '#0a1929' : '#0cc0df',
        transition: 'background-color 0.3s ease'
    };

    const getTextClass = (): string => {
        return theme === 'dark' ? 'text-light' : 'text-dark';
    };


    return (
        <nav className="navbar fixed-top  navbar-expand-lg
        " data-bs-theme={theme}
             style={navbarStyle}>
            <div className={`container-fluid ${getTextClass()}`}>
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="Logo" width="24" height="24"
                         className="d-inline-block align-text-top"/>
                    keep-u
                </a>
                <button className={`navbar-toggler ${getTextClass()}`} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    {
                        !isAuthenticated && (
                            <>
                                {/*izquierda*/}
                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <Switch />
                                    </li>
                                </ul>
                                {/*derecha*/}
                                <ul className="navbar-nav ms-auto  mb-2 mb-lg-0">
                                    <li className="nav-item"> <Link to="/" className="nav-link"> HOME </Link> </li>
                                    <li className="nav-item"> <Link to="/" className="nav-link"> NOSOTROS </Link> </li>
                                    <li className={"nav-item"}> <Link to={"/login"} className={"nav-link"} >
                                        <YellowButton>INICIAR SESIÓN</YellowButton>
                                    </Link> </li>
                                    <li className="nav-item"><Link to="/signup" className="nav-link" >
                                        <GrayButton>REGISTRARSE</GrayButton>
                                    </Link></li>

                                </ul>
                            </>
                        )
                    }
                    {
                        user?.userType=="CHILD" && isAuthenticated && (
                            <>
                                {/*izquierda*/}
                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <Switch />
                                    </li>
                                </ul>
                                {/*derecha*/}
                                <ul className="navbar-nav ms-auto  mb-2 mb-lg-0">
                                    <li className="nav-item"> <Link to="/homeChildren" className="nav-link"> HOME </Link> </li>
                                    <li className="nav-item"> <Link to="/" className="nav-link"> HISTORIAL </Link> </li>
                                    <li className="nav-item"> <Link to="/" className="nav-link"> TIENDA </Link> </li>

                                    <li className="nav-item"><Link to="/signup" className="nav-link" >
                                        <GrayButton>{user.name}</GrayButton>
                                    </Link></li>
                                        <button className="nav-link btn btn-link btn-outline-primary" onClick={handleLogout}>
                                            CERRAR SESIÓN
                                        </button>
                                </ul>
                            </>
                        )
                    }
                    {
                        user?.userType=="PARENT" && isAuthenticated&& (
                            <>
                                {/*izquierda*/}
                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <Switch />
                                    </li>
                                </ul>
                                {/*derecha*/}
                                <ul className="navbar-nav ms-auto  mb-2 mb-lg-0">
                                    <li className="nav-item"> <Link to="/homeParent" className="nav-link"> HOME </Link> </li>
                                    <li className="nav-item"> <Link to="/parentHistory" className="nav-link"> HISTORIAL </Link> </li>
                                    <li className="nav-item"> <Link to="/" className="nav-link"> HIJOS </Link> </li>

                                    <li className="nav-item"><Link to="/signup" className="nav-link" >
                                        <GrayButton>{user.name}</GrayButton>
                                    </Link></li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link btn-outline-primary" onClick={handleLogout}>
                                            CERRAR SESIÓN
                                        </button>
                                    </li>
                                </ul>
                            </>
                        )
                    }


                </div>

            </div>
        </nav>
    )
}

export default NavbarComponent