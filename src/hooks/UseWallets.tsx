import {useContext} from "react";
import {WalletContext} from "../context/WalletContext.tsx";

export const useWallets = () => {
    return useContext(WalletContext);
}