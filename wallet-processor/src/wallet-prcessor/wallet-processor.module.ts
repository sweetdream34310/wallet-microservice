import { Module } from '@nestjs/common';
import { WalletProcessorController } from './wallet-processor.controller';
import { WalletProcessorService } from './wallet-processor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from 'src/models/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [WalletProcessorController],
  providers: [WalletProcessorService],
})
export class WalletProcessorModule {}
