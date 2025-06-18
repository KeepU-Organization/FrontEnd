import { createContext, ReactNode, useEffect, useState } from "react";
import { userService } from "../services/RegisterLoginService.tsx";



// Definimos un tipo User coherente con lo que manejamos en la aplicación
interface User {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    isAuthenticated: boolean;
    userType:string;
    profilePicture: string; // Aseguramos que sea una cadena, incluso si es vacía
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateCurrentUser: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => false,
    logout: () => {},
    updateCurrentUser: async () => {},
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Comprobar si ya hay un token guardado al cargar la aplicación
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if (token) {
                    // Verificar si el token es válido antes de hacer la petición
                    try {
                        const userData = await userService.getCurrentUser();

                        const user: User = {
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            emailVerified: userData.isEmailVerified,
                            isAuthenticated: true,
                            userType: userData.userType,
                            profilePicture: userData.profilePicture || '', // Aseguramos que profilePicture sea una cadena
                        };
                        setUser(user);
                    } catch (error) {
                        // Si hay error con el token, lo eliminamos
                        console.error('Token inválido o sesión expirada:', error);
                        localStorage.removeItem('authToken');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error al verificar la autenticación:', error);
                localStorage.removeItem('authToken');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);


    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await userService.login(email, password);

            if (response.token) {
                localStorage.setItem('authToken', response.token);

                // Obtenemos datos actualizados del usuario después del login
                await updateCurrentUser();
                return true;
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
        return false;
    };


    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };


    const updateCurrentUser = async (): Promise<void> => {
        try {
            const userData = await userService.getCurrentUser();

            if (userData) {
                const updatedUser: User = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    emailVerified: userData.isEmailVerified,
                    isAuthenticated: true,
                    userType: userData.userType,
                    profilePicture: userData.profilePicture || '', // Aseguramos que profilePicture sea una cadena
                };
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Error al actualizar datos del usuario:', error);
            // Si hay un error grave, desconecta al usuario
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading: loading,
            login,
            logout,
            updateCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};