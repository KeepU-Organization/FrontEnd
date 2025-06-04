export interface TransactionResponse{
    amount: number;
    description: string;
    transactionType:string; // 'deposito, transeferencia
    transactionDate: string;
}