export interface TransactionResponse{
    amount: number;
    description: string;
    transactionType:string; // 'deposito, transeferencia
    transactionDate: string;
    giftCardCode:string;
    storeName:string;
    storeType:string;
}
export interface CreateTransferRequest {
    senderWalletId: string;
    receiverWalletId: string;
    transactionAmount: number;
}
export interface TransferResponse {
    senderWalletId: string;
    receiverWalletId: string;
    transactionAmount: number;
}
