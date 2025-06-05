import {createContext, useEffect, useState} from "react";
import {useAuth} from "../hooks/UseAuth.tsx";
import {walletService} from "../services/WalletService.tsx";
import {WalletResponse} from "../types/Wallets.tsx";


export interface WalletContextType {
    wallets: WalletResponse[];
    isLoading: boolean;
    error: string | null;
    refreshWallets: () => Promise<void>;
    fetchChildrenWallets: (childId: number) => Promise<void>;
    childWallets:WalletResponse[];
}

// En el defaultWalletContext
const defaultWalletContext: WalletContextType = {
    wallets: [],
    isLoading: true,
    error: null,
    refreshWallets: async () => {},
    fetchChildrenWallets: async () => {},
    childWallets: [],
};
export const WalletContext = createContext<WalletContextType>(defaultWalletContext);

interface WalletProviderProps {
    children: React.ReactNode;
}
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [wallets, setWallets] = useState<WalletResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [childWallets, setChildWallets] = useState<WalletResponse[]>([]);

    const {user}= useAuth();

    const fetchWallets = async () => {
        setIsLoading(true);
        try {
            if (user){
                const response = await walletService.getWalletByUserId(user?.id);
                if (response) {
                    setWallets([response]);
                } else {
                    setError('No se encontraron wallets para el usuario');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar las wallets');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchChildrenWallets = async (childId: number) => {
        setIsLoading(true);
        try {
            if (isNaN(childId)) {
                throw new Error('ID de hijo inválido');
            }

            const response = await walletService.getWalletByUserId(childId);
            if (response) {
                setChildWallets([response]);
            } else {
                setError('No se encontraron wallets para el usuario');
            }
        } catch (err) {
            console.error('Error al cargar wallets del hijo:', err);
            setError('Error al cargar las wallets');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, [user]);

    return (
        <WalletContext.Provider value={{
            wallets,
            isLoading,
            error,
            refreshWallets: fetchWallets,
            fetchChildrenWallets: fetchChildrenWallets,
            childWallets
        }}>
            {children}
        </WalletContext.Provider>
    );
};