import { Module } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletApiModule } from './wallet-api/wallet-api.module';
import { config } from './config/config';
import { SeedService } from './seeding-data/seed-service';
import {
  Customer,
  CustomerSchema,
  CustomerDocument,
} from './models/customer.schema';
import { Model } from 'mongoose';
import { UnsuccessfulTransactionScheduler } from './retry-scheduler/retry-scheduler.service';

@Module({
  imports: [
    WalletApiModule,
    MongooseModule.forRoot(`${config.db.mongoBaseUri}${config.db.dbName}`),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    private seedService: SeedService,
  ) {}

  async onApplicationBootstrap() {
    try {
      const isSeedingRequired = await this.isSeedingRequired();
      if (isSeedingRequired) {
        await this.seedService.seedFromS3();
      }
    } catch (error) {}
  }

  async isSeedingRequired(): Promise<boolean> {
    const customerCount = await this.CustomerModel.countDocuments().exec();
    return customerCount === 0; // Seeding is required if there are no customers in the database
  }
}
