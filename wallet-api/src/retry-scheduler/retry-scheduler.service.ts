import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WalletApiService } from '../wallet-api/wallet-api.service';

@Injectable()
export class UnsuccessfulTransactionScheduler {
  constructor(private readonly walletApiService: WalletApiService) {}

  @Cron('0 * * * *') // Run every hour
  async retryUnsuccessfulTransactions() {
    const unsuccessfulTransactions = await this.walletApiService.getUnsuccessfulTransactions();

    console.log(unsuccessfulTransactions)
    for (const unsuccessfulTransaction of unsuccessfulTransactions) {
      
        
      // If successful, delete the unsuccessful transaction
      await this.walletApiService.deleteUnsuccessfulTransaction(unsuccessfulTransaction._id);
    }
  }
}
