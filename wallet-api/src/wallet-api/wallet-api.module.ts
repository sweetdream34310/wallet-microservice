import { Module } from '@nestjs/common';
import { WalletApiController } from './wallet-api.controller';
import { WalletApiService } from './wallet-api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from 'src/models/customer.schema';
import { UnsuccessfulTransaction, UnsuccessfulTransactionSchema } from 'src/models/unsuccessfulTransaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: UnsuccessfulTransaction.name, schema: UnsuccessfulTransactionSchema }]),
  ],
  controllers: [WalletApiController],
  providers: [WalletApiService],
})
export class WalletApiModule {}
