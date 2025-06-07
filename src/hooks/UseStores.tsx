import {useContext} from "react";
import {StoreContext} from "../context/StoreContext.tsx";

export const useStores = () => {
    return useContext(StoreContext);
}