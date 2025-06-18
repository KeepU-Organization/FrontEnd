import { ModulesResponse } from "../types/Modules";
import {createContext, FC, ReactNode, useCallback,  useState} from "react";
import {moduleService} from "../services/ModuleService.tsx";

export interface ModuleContext {
    modules: ModulesResponse[];
    isLoading: boolean;
    error: string | null;
    fetchModules: (courseCode: string) => Promise<void>;
}
const defaultModuleContext: ModuleContext={
    modules: [],
    isLoading: true,
    error: null,
    fetchModules: async () => {},
}
interface ModulesContextProviderProps {
    children: ReactNode;
}
export const ModulesContext = createContext<ModuleContext>(defaultModuleContext);
export const ModulesContextProvider: FC<ModulesContextProviderProps> = ({ children }) => {
    const [modules, setModules] = useState<ModulesResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchModules =useCallback (async (courseCode:string) => {
        setIsLoading(true);
        try {
            const response = await moduleService.getModulesByCode(courseCode);
            setModules(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los módulos');
        } finally {
            setIsLoading(false);
        }
    },[]);


    return (
        <ModulesContext.Provider value={{ modules, isLoading, error, fetchModules }}>
            {children}
        </ModulesContext.Provider>
    );
};