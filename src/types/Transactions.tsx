export interface TransactionResponse{
    amount: number;
    description: string;
    transactionType:string; // 'deposito, transeferencia
    transactionDate: string;
}
export interface CreateTranferRequest {
    senderWalletId: string;
    receiverWalletId: string;
    transactionAmount: number;
}
export interface TransferResponse {
    senderWalletId: string;
    receiverWalletId: string;
    transactionAmount: number;
}