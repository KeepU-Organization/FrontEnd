import logo from '../../assets/logo.png'
import logoWhite from '../../assets/logo-white.png'
import { Link, useNavigate } from "react-router-dom";
import { GrayButton, YellowButton } from "../buttons/Buttons.tsx"
import "./Navbar.scss"
import { useTheme } from "../../ThemeContext.tsx";
import React, { useRef, useState, useEffect } from "react";
import Switch from "../buttons/Switch.tsx";
import { useAuth } from "../../hooks/UseAuth.tsx";

// Definir el tipo para Bootstrap
declare global {
}

const NavbarComponent: React.FC = () => {
    const { theme } = useTheme();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const navbarCollapseRef = useRef<HTMLDivElement>(null);
    const navbarToggleRef = useRef<HTMLButtonElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Efecto para manejar clics fuera del navbar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // No cerrar si el clic fue en el botón toggle o dentro del navbar
            if (
                navbarToggleRef.current?.contains(target) ||
                navbarCollapseRef.current?.contains(target)
            ) {
                return;
            }

            // Solo cerrar si está abierto y el clic fue fuera
            if (!isCollapsed) {
                closeNavbar();
            }
        };

        if (!isCollapsed) {
            // Usar setTimeout para evitar que se ejecute inmediatamente después del toggle
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed]);

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    const handleLogout = () => {
        logout();
        navigate("/");
        closeNavbar();
    };

    const handleNosotrosClick = () => {
        if (window.location.pathname === '/') {
            // Si ya estamos en home, solo hace scroll
            const element = document.getElementById('nuestro-equipo');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Si no estamos en home, navega y luego hace scroll
            navigate('/#nuestro-equipo');
        }
        closeNavbar();
    };

    const closeNavbar = () => {
        setIsCollapsed(true);

        if (navbarCollapseRef.current) {
            // Usar Bootstrap si está disponible
            if (window.bootstrap?.Collapse) {
                const bsCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        }
    };

    const toggleNavbar = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsCollapsed(!isCollapsed);
    };

    const handleNavClick = () => {
        closeNavbar();
    };

    const navbarStyle = {
        backgroundColor: theme === 'dark' ? '#0a1929' : '#0cc0df',
        transition: 'background-color 0.3s ease'
    };

    const getTextClass = (): string => {
        return theme === 'dark' ? 'text-light' : 'text-dark';
    };

    const logoSrc = theme === 'dark' ? logoWhite : logo;

    const UserAvatar = () => {
        const profilePicUrl = user?.profilePicture
            ? import.meta.env.VITE_API_URL + user.profilePicture
            : import.meta.env.VITE_API_URL + "uploads/profilePics/default.jpg";
        return (
            <div className="d-flex align-items-center ms-2">
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
                <button
                    ref={navbarToggleRef}
                    className={`navbar-toggler ${getTextClass()}`}
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="navbarSupportedContent"
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
                    id="navbarSupportedContent"
                    ref={navbarCollapseRef}
                >
                    <ul className="navbar-nav me-auto d-flex align-items-center">
                        <li className="nav-item">
                            <Switch />
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                        {!isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link" onClick={handleNavClick}>HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/#nuestro-equipo" className="nav-link" onClick={handleNosotrosClick}>NOSOTROS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link" onClick={handleNavClick}>
                                        <YellowButton>INICIAR SESIÓN</YellowButton>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="nav-link" onClick={handleNavClick}>
                                        <GrayButton>REGISTRARSE</GrayButton>
                                    </Link>
                                </li>
                            </>
                        )}
                        {isAuthenticated && user?.userType === "PARENT" && (
                            <>
                                <li className="nav-item">
                                    <Link to="/homeParent" className="nav-link" onClick={handleNavClick}>HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/parentHistory" className="nav-link" onClick={handleNavClick}>HISTORIAL</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/childMonitor" className="nav-link" onClick={handleNavClick}>HIJOS</Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={
                                            user?.userType === "PARENT"
                                                ? "/EditarPerfilPadre"
                                                : user?.userType === "CHILD"
                                                    ? "/EditarPerfilHijo"
                                                    : "#"
                                        }
                                        className="nav-link"
                                        onClick={handleNavClick}
                                    >
                                        <UserAvatar />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                                        CERRAR SESIÓN
                                    </button>
                                </li>
                            </>
                        )}
                        {isAuthenticated && user?.userType === "CHILD" && (
                            <>
                                <li className="nav-item">
                                    <Link to="/homeChildren" className="nav-link" onClick={handleNavClick}>HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/childHistory" className="nav-link" onClick={handleNavClick}>HISTORIAL</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/store" className="nav-link" onClick={handleNavClick}>TIENDA</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/academia" className="nav-link" onClick={handleNavClick}>ACADEMIA</Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={
                                            user?.userType === "CHILD"
                                                ? "/EditarPerfilHijo"
                                                : user?.userType === "PARENT"
                                                    ? "/EditarPerfilPadre"
                                                    : "#"
                                        }
                                        className="nav-link"
                                        onClick={handleNavClick}
                                    >
                                        <UserAvatar />
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                                        CERRAR SESIÓN
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarComponent