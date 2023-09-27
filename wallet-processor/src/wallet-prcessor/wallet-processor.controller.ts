import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { WalletProcessorService } from './wallet-processor.service';
import { Chunk } from './dto/chunk.dto';
import { ObjectId } from 'mongoose';

@Controller('wallet-processor')
export class WalletProcessorController {
  constructor(private readonly WalletProcessorService: WalletProcessorService) {}


  @Post('transaction')
  async processTransaction(@Body() chunks: Chunk[] ){
    return this.WalletProcessorService.processTransaction(chunks);
    
  }
}
