import {WalletResponse} from "./Wallets.tsx";
import {GiftCard} from "./GiftCards.tsx";

export interface CreateShopRequest {
    walletId: string;
    storeId:number;
    quantity: number;
    amount: number;
}
export interface ShopResponse {
    wallet:WalletResponse;
    giftCards:GiftCard[];
    storeName:string;
    amount:number;

}