export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: string;
  date: string;
  walletId?: string;
  walletName?: string;
  storeType?: string;
  storeName?: string;
  giftCardCode?: string;
}


export interface TransactionResponse {
  amount: number;
  description: string;
  transactionType: string; // 
  transactionDate: string;
  walletId?: string;
  walletName?: string;
  storeType?: string;
  storeName?: string;
  giftCardCode?: string;
}


export interface CreateTransferRequest {
  senderWalletId: string;
  receiverWalletId: string;
  transactionAmount: number;
  description?: string;
}
