import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import {
  TransactionDto,
  UnsuccessfulTransactionDto,
} from './dto/transaction.dto/transaction.dto';
import { Customer, CustomerDocument } from 'src/models/customer.schema';
import {
  UnsuccessfulTransaction,
  UnsuccessfulTransactionDocument,
} from 'src/models/unsuccessfulTransaction.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { baseUrl, walletProcessorPort } from 'src/config/config';

@Injectable()
export class WalletApiService {
  private API_KEY = process.env.API_KEY;

  private chunkTransactions(transactions: TransactionDto[]) {
    const sortedTransactions = transactions.sort((a, b) => b.value - a.value);
    const chunks = [];
    let chunk = { transactions: [], totalValue: 0, timeLeft: 1000 };

    for (const transaction of sortedTransactions) {
      if (chunk.timeLeft >= transaction.latency) {
        chunk.transactions.push(transaction);
        chunk.totalValue += transaction.value;
        chunk.timeLeft -= transaction.latency;
      } else {
        chunks.push({ ...chunk });
        chunk = {
          transactions: [transaction],
          totalValue: transaction.value,
          timeLeft: 1000 - transaction.latency,
        };
      }
    }

    chunks.push({ ...chunk });

    return chunks.sort((a, b) => b.totalValue - a.totalValue);
  }

  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(UnsuccessfulTransaction.name)
    private UnsuccessfulTransactionDocument: Model<UnsuccessfulTransactionDocument>,
  ) {}

  async transaction(transactionDto: TransactionDto[], apiKey: string) {
    // api key validation.
    if (apiKey !== this.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    // sorted chunks in priority of total value
    const chunks = this.chunkTransactions(transactionDto);

    const url = `${baseUrl}:${walletProcessorPort}/wallet-processor/transaction`;

    // send sorted chunks to processor. no need res. Just send
    await axios.post(url, chunks);
  }

  async unsuccessfulTransaction(
    unsuccessfulTransactions: UnsuccessfulTransactionDto[],
  ) {
    try {
      const retryAfter = new Date(Date.now() + 60 * 60 * 1000); // Retry after 1 hour

      const transactionsToRetry = unsuccessfulTransactions.map(
        (transaction) => ({
          ...transaction,
          retryAfter,
        }),
      );

      await this.UnsuccessfulTransactionDocument.create(transactionsToRetry);
    } catch (error) {
      console.error(`Error while creating transactions: ${error}`);
    }
  }

  async getUnsuccessfulTransactions() {
    return this.UnsuccessfulTransactionDocument.find({
      retryAfter: { $lte: new Date() },
    }).exec();
  }

  async deleteUnsuccessfulTransaction(id: string) {
    let transaction = await this.UnsuccessfulTransactionDocument.findById(
      new mongoose.Types.ObjectId(id),
    );

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    try {
      await transaction.deleteOne();

      return {
        message: `Delete transaction with ID ${id} successfully`,
        status: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting. Try again');
    }
  }

  async getCustomerById(id: string, apiKey: string) {
    let customer = await this.CustomerModel.findById(
      new mongoose.Types.ObjectId(id),
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    console.log(apiKey);
    if (apiKey) {
      if (apiKey !== this.API_KEY) {
        throw new Error('Invalid API key');
      }

      console.log(customer.credit_card);
      return {
        name: `${customer.first_name} ${customer.last_name}`,
        balance: customer.credit_card.ballance,
      };
    } else {
      return {
        name: `${customer.first_name} ${customer.last_name}`,
      };
    }
    // throw new InternalServerErrorException('Error in fetching. Try again');
  }

  async deleteCustomerById(id: string) {
    let customer = await this.CustomerModel.findById(
      new mongoose.Types.ObjectId(id),
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    try {
      await customer.deleteOne();

      return {
        message: `Delete customer with ID ${id} successfully`,
        status: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in deleting. Try again');
    }
  }

  async updateCustomerById(id: string, customerData: any) {
    let customer = await this.CustomerModel.findById(
      new mongoose.Types.ObjectId(id),
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (customerData.first_name) {
      customer.first_name = customerData.first_name;
    }

    if (customerData.last_name) {
      customer.last_name = customerData.last_name;
    }

    if (customerData.balance) {
      customer.credit_card.ballance = customerData.balance;
      customer.markModified('credit_card');
    }

    try {
      await customer.save();
      return `Updated customer with ID ${id} successfully`;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating. Try again');
    }
  }
}
