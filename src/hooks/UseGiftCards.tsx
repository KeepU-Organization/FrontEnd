import {useContext} from "react";
import {GiftCardContext} from "../context/GIftCardsContext.tsx";

export const UseGiftCards = () => {
    return useContext(GiftCardContext);
}