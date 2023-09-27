import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletProcessorModule } from './wallet-prcessor/wallet-processor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/config';

@Module({
  imports: [
    WalletProcessorModule,
    MongooseModule.forRoot(`${config.db.mongoBaseUri}${config.db.dbName}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
