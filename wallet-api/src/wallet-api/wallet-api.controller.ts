import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { TransactionDto, UnsuccessfulPayloadDto, UnsuccessfulTransactionDto } from './dto/transaction.dto/transaction.dto';
import { WalletApiService } from './wallet-api.service';

@Controller('wallet-api')
export class WalletApiController {
  constructor(private readonly walletApiService: WalletApiService) {}


  @Post('transaction')
  async Transaction(@Body() transactionDto: TransactionDto[], @Headers('api-key') apiKey: string) {
    return this.walletApiService.transaction(transactionDto, apiKey);
  }

  @Post('transaction/unsuccessful')
  async UnsuccessfulTransactions(@Body() unsuccessfulTransactions: UnsuccessfulTransactionDto[]) {
    return this.walletApiService.unsuccessfulTransaction(unsuccessfulTransactions);
  }

  @Get('customer/:id')
  async getCustomer(@Param('id') id: string, @Headers('api-key') apiKey: string) {
    return this.walletApiService.getCustomerById(id, apiKey);
  }

  @Delete('customer/:id')
  async deleteCustomer(@Param('id') id: string) {
    return this.walletApiService.deleteCustomerById(id);
  }

  @Patch('customer/:id')
  async updateCustomer(@Param('id') id: string, @Body() customerData: any) {
    return this.walletApiService.updateCustomerById(id, customerData);
  }
}
