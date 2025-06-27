import logo from '../../assets/logo.png'
import logoWhite from '../../assets/logo-white.png'
import cerrar from '../../assets/cerrar.png'
import editar from '../../assets/edit.png'
import { Link, useNavigate } from "react-router-dom";
import { GrayButton, YellowButton } from "../buttons/Buttons.tsx"
import "./Navbar.scss"
import { useTheme } from "../../ThemeContext.tsx";
import React , { useState } from "react";
import Switch from "../buttons/Switch.tsx";
import { useAuth } from "../../hooks/UseAuth.tsx";




const NavbarComponent: React.FC = () => {
    const { theme } = useTheme();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navbarStyle = {
        backgroundColor: theme === 'dark' ? '#0a1929' : '#0cc0df',
        transition: 'background-color 0.3s ease'
    };

    const getTextClass = (): string => {
        return theme === 'dark' ? 'text-light' : 'text-dark';
    };

    const logoSrc = theme === 'dark' ? logoWhite : logo;

    // Componente avatar estilizado
    const UserAvatar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const profilePicUrl = user?.profilePicture
        ? import.meta.env.VITE_API_URL + user.profilePicture
        : import.meta.env.VITE_API_URL + "uploads/profilePics/default.jpg";

    const toggleMenu = () => setShowMenu(!showMenu);

   

      return (
  <div className="position-relative">
    {/* Avatar con evento onClick */}
    <div
      className="d-flex align-items-center ms-2"
      onClick={toggleMenu}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={profilePicUrl}
        alt="avatar"
        width={32}
        height={32}
        className="rounded-circle border"
        style={{ objectFit: 'cover', marginRight: 8 }}
      />
      <span className="fw-semibold">{user?.name}</span>
    </div>

    {/* Menú desplegable */}
    {showMenu && (
      <div
        className="position-absolute p-2"
        style={{
          top: "100%",
          //right: 0,
          zIndex: 1000,
          marginTop: "22.5px",
          backgroundColor: " rgb(12 192 223)", // azul
          borderRadius: "8px",
          color: "black", // texto negro
          minWidth: "160px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)"
        }}
      >
        <button
          className="dropdown-item d-flex align-items-center gap-2"
          style={{ backgroundColor: "transparent", color: "black" }}
          onClick={() =>
            navigate(user?.userType === "PARENT" ? "/EditarPerfilPadre" : "/EditarPerfilHijo")
          }
        >
          <img src={editar} alt="Editar" width={18} height={18} />
          Editar perfil
        </button>

        <button
          className="dropdown-item d-flex align-items-center gap-2"
          style={{ backgroundColor: "transparent", color: "black" }}
          onClick={handleLogout}
        >
          <img src={cerrar} alt="Cerrar sesión" width={18} height={18} />
          Cerrar sesión
        </button>
      </div>
    )}
  </div>
);


    };


    return (
        <nav className="navbar fixed-top navbar-expand-lg" data-bs-theme={theme} style={navbarStyle}>
            <div className={`container-fluid ${getTextClass()}`}>
                <a className="navbar-brand d-flex align-items-center" href="#" style={{ gap: 8 }}>
                    <img
                        src={logoSrc}
                        alt="Logo"
                        width="40"
                        height="50"
                        style={{ display: 'block' }}
                    />
                </a>
                <button className={`navbar-toggler ${getTextClass()}`} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Izquierda: Switch */}
                    <ul className="navbar-nav me-auto d-flex align-items-center">
                        <li className="nav-item">
                            <Switch />
                        </li>
                    </ul>
                    {/* Derecha: Links según tipo de usuario */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center" style={{ marginLeft: "auto", marginRight: "50px" }}>
                        {!isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">NOSOTROS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        <YellowButton>INICIAR SESIÓN</YellowButton>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link">
                                        <GrayButton>REGISTRARSE</GrayButton>
                                    </Link>
                                </li>
                            </>
                        )}
                        {isAuthenticated && user?.userType === "PARENT" && (
                            <>
                                <li className="nav-item">
                                    <Link to="/homeParent" className="nav-link">HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/parentHistory" className="nav-link">HISTORIAL</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/childMonitor" className="nav-link">HIJOS</Link>
                                </li>
                                <li className="nav-item">
                                    <UserAvatar />
                                </li>
                                {/* */}
                                {/*<li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                                        CERRAR SESIÓN
                                    </button>
                                </li>*/}
                            </>
                        )}
                        {isAuthenticated && user?.userType === "CHILD" && (
                            <>
                                <li className="nav-item">
                                    <Link to="/homeChildren" className="nav-link">HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/childHistory" className="nav-link">HISTORIAL</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/store" className="nav-link">TIENDA</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/academia" className="nav-link">ACADEMIA</Link>
                                </li>
                                <li className="nav-item">
                                    <UserAvatar />
                                </li>
                                
                                {/*<li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                                        CERRAR SESIÓN
                                    </button>
                                </li>*/}
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarComponent