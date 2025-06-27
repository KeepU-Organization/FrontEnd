export interface TransactionResponse {
    amount: number;
    description: string;
    transactionType: string; // 'DEPOSIT', 'TRANSFER'
    transactionDate: string;
    walletId?: string;
    walletName?: string;
    storeType:string;
    storeName: string;
    giftCardCode: string;
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: string; // 'DEPOSIT', 'TRANSFER'
    date: string;
    walletId?: string;
    walletName?: string;
}

export interface CreateTransferRequest {
    senderWalletId:string;
    receiverWalletId:string;
    transactionAmount: number;
}