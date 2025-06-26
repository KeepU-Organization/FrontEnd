import { ContentItemResponse } from "../types/ContentItem.tsx";
import { createContext, FC, ReactNode,  useState, useCallback } from "react";
import { contentItemService } from "../services/ContentItemService.tsx";

export interface ContentItemContext {
    contentItems: ContentItemResponse[];
    isLoading: boolean;
    error: string | null;
    fetchContentItems: (moduleCode: string) => Promise<void>;
}

const defaultContentItemContext: ContentItemContext = {
    contentItems: [],
    isLoading: true,
    error: null,
    fetchContentItems: async () => {},
}

interface ContentItemContextProviderProps {
    children: ReactNode;
}

export const ContentItemContext = createContext<ContentItemContext>(defaultContentItemContext);

export const ContentItemContextProvider: FC<ContentItemContextProviderProps> = ({ children }) => {
    const [contentItems, setContentItems] = useState<ContentItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Inicialmente false
    const [error, setError] = useState<string | null>(null);

    const fetchContentItems = useCallback(async (moduleCode: string) => {
        if (!moduleCode || moduleCode === ' ') return; // Evita llamadas con cadenas vacías

        setIsLoading(true);
        try {
            const response = await contentItemService.getContentItemsByModuleId(moduleCode);
            setContentItems(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los elementos de contenido');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <ContentItemContext.Provider value={{ contentItems, isLoading, error, fetchContentItems }}>
            {children}
        </ContentItemContext.Provider>
    );
}