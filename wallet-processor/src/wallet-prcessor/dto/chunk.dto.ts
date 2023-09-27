export class TransactionDto {
    value: number;
    latency: number;
    customerId: string;
}
  

export class Chunk {
    transactions : TransactionDto[];
    totalValue : number;
    timeLeft : number;
}
  
export class UnsuccessfulTransactionDto {
    transaction : TransactionDto;
    reason : string
}