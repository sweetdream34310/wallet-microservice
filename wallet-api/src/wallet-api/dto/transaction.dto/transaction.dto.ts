import { ObjectId } from 'mongoose';

export class TransactionDto {
  value: number;
  latency: number;
  customerId: string;
}

export class UnsuccessfulTransactionDto {
  transaction: TransactionDto;
  reason: string;
}

export class UnsuccessfulPayloadDto {
  customerId: ObjectId;
  unsuccessfulTransactions: UnsuccessfulTransactionDto[];
}
