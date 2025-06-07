import {StoreResponse} from "../types/Stores.tsx";
import {createContext, useEffect, useState} from "react";
import {storeService} from "../services/StoreService.tsx";

export interface StoreContext{
    stores: StoreResponse[];
    isLoading: boolean;
    error: string | null;
    fetchStores: () => Promise<void>;
}
const defaultStoreContext: StoreContext = {
    stores: [],
    isLoading: true,
    error: null,
    fetchStores: async () => {},
}
interface StoreContextProviderProps {
    children: React.ReactNode;
}

export const StoreContext = createContext<StoreContext>(defaultStoreContext);

export const StoreContextProvider:React.FC<StoreContextProviderProps> = ({children}) => {
    const [stores, setStores] = useState<StoreResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStores = async () => {
        setIsLoading(true);
        try {
            const response = await storeService.getAllStores();
            setStores(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar las tiendas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <StoreContext.Provider value={{ stores, isLoading, error, fetchStores }}>
            {children}
        </StoreContext.Provider>
    );
}