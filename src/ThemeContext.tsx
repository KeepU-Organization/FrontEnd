import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

// Crear el contexto de tema con un valor inicial
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

// Proveedor del contexto de tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Intentar obtener el tema guardado en localStorage o usar 'light' como predeterminado
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'dark' ? 'dark' : 'light');
    });

    // Cambiar entre temas 'light' y 'dark'
    const toggleTheme = (): void => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    // Aplicar el tema al documento HTML
    useEffect(() => {
        // Aplicar clases de Bootstrap para el tema
        document.documentElement.setAttribute('data-bs-theme', theme);

        // También puedes agregar una clase al body para estilos personalizados
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para usar el contexto de tema
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};