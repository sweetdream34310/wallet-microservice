import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Customer, CustomerDocument } from 'src/models/customer.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chunk, UnsuccessfulTransactionDto } from './dto/chunk.dto';
import axios from 'axios';
import { baseUrl, walletApiPort } from 'src/config/config';

@Injectable()
export class WalletProcessorService {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
  ) {}

  async processTransaction(chunks: Chunk[]) {
    let unsuccessfulTransactions: UnsuccessfulTransactionDto[] = [];

    const promises = [];

    chunks.forEach((chunk) => {
      chunk.transactions.forEach((transaction) => {
        const customerId = transaction.customerId;
        const promise = this.CustomerModel.findById(customerId).then(
          (customer) => {
            if (!customer) {
              // unsuccessful transaction
              const reason = 'customer does not exist';
              unsuccessfulTransactions.push({ transaction, reason });
            } else {
              const balance = customer.credit_card.ballance;

              if (balance >= transaction.value) {
                customer.credit_card.ballance -= transaction.value;
                customer.markModified('credit_card');
                return customer.save().catch((error) => {
                  const reason = 'server error';
                  unsuccessfulTransactions.push({ transaction, reason });
                });
              } else {
                const reason = 'not enough balance';
                unsuccessfulTransactions.push({ transaction, reason });
              }
            }
          },
        );
        promises.push(promise);
      });
    });

    await Promise.all(promises);

    const url = `${baseUrl}:${walletApiPort}/wallet-api/transaction/unsuccessful`;

    try {
      // Send the unsuccessful transactions to the transaction service
      await axios.post(url, unsuccessfulTransactions);
    } catch (error) {
      console.log(error);
    }
  }
}
