import {GiftCard} from "../types/GiftCards.tsx";
import {createContext, useEffect, useState} from "react";
import {GiftCardService} from "../services/GiftCardService.tsx";

export interface GiftCardContest {
    giftcards:GiftCard[];
    isLoading: boolean;
    error: string | null;
    fetchGiftCards: () => Promise<void>;

}
const defaultGiftCardContext: GiftCardContest = {
    giftcards: [],
    isLoading: true,
    error: null,
    fetchGiftCards: async () => {},
}
interface GiftCardContextProviderProps {
    children: React.ReactNode;
}
export const GiftCardContext = createContext<GiftCardContest>(defaultGiftCardContext);
export const GiftCardContextProvider: React.FC<GiftCardContextProviderProps> = ({children}) => {
    const [giftcards, setGiftCards] = useState<GiftCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGiftCards = async () => {
        setIsLoading(true);
        try {
            const response = await GiftCardService.getAllGiftCards();
            setGiftCards(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar las gift cards');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, []);

    return (
        <GiftCardContext.Provider value={{ giftcards, isLoading, error, fetchGiftCards }}>
            {children}
        </GiftCardContext.Provider>
    );
}
