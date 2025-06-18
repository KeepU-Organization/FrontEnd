import {ModulesContext} from "../context/ModulesContext.tsx";
import {useContext} from "react";

export const useModules = () => {
    return useContext(ModulesContext);
}