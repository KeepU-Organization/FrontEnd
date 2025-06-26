export interface GiftCard {
    id: number;
    code: string;
    amount: number;
    isRedeemed: boolean;
    createdAt: string;
    redeemedAt: string;
    storeId: number;
}