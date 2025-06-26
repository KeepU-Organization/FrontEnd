import React from 'react';
import { useTheme } from '../../ThemeContext';

const Footer: React.FC = () => {
    const { theme } = useTheme();

    const colorPalettes = {
        light: {
            bg: '#f7fafc',
            text: '#424242',
            accent: '#00bcd4',
            border: '#e0e0e0',
        },
        dark: {
            bg: '#23272f',
            text: '#e0e0e0',
            accent: '#4dd0e1',
            border: '#37474f',
        }
    };
    const colors = colorPalettes[theme];

    const style: React.CSSProperties = {
        width: '100%',
        background: colors.bg,
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 1.2rem 1rem',
        fontSize: '1rem',
        marginTop: '2rem',
        borderTop: `1.5px solid ${colors.border}`,
        boxShadow: '0 -1px 8px rgba(0,0,0,0.04)',
    };

    const linksStyle: React.CSSProperties = {
        display: 'flex',
        gap: '1.2rem',
        margin: '0.7rem 0 1.1rem 0',
        flexWrap: 'wrap',
        justifyContent: 'center',
    };

    const linkStyle: React.CSSProperties = {
        color: colors.accent,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'color 0.2s',
    };

    const legalStyle: React.CSSProperties = {
        marginTop: 8,
        fontSize: '0.97rem',
        opacity: 0.8,
        textAlign: 'center',
    };

    return (
        <footer style={style}>
            <div style={{ fontWeight: 800, fontSize: '1.13rem', letterSpacing: '0.5px', marginBottom: 4 }}>
                Tu Futuro Financiero
            </div>
            <nav style={linksStyle}>
                <a href="/about" style={linkStyle}>Sobre nosotros</a>
                <a href="/faq" style={linkStyle}>FAQ</a>
                <a href="/contact" style={linkStyle}>Contacto</a>
                <a href="/jobs" style={linkStyle}>Trabaja con nosotros</a>
                <a href="/libro-de-reclamaciones" style={linkStyle}>Libro de reclamaciones</a>
            </nav>
            <div style={legalStyle}>
                © {new Date().getFullYear()} Tu Futuro Financiero. Todos los derechos reservados.<br />
            </div>
        </footer>
    );
};

export default Footer;