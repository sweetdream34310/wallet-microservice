import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WalletApiController } from '../../wallet-api/wallet-api.controller';
import { WalletApiService } from '../../wallet-api/wallet-api.service';
import { TransactionDto } from '../../wallet-api/dto/transaction.dto/transaction.dto';

describe('WalletApiController', () => {
  let controller: WalletApiController;
  let service: WalletApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletApiController],
      providers: [
        WalletApiService,
        {
          provide: getModelToken('Customer'),
          useValue: {},
        },
        {
          provide: getModelToken('UnsuccessfulTransaction'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WalletApiController>(WalletApiController);
    service = module.get<WalletApiService>(WalletApiService);
  });

  describe('Transaction', () => {
    it('should call WalletApiService.transaction with the correct parameters', async () => {
      const transactionDto: TransactionDto[] = [
        {
          value: 110,
          latency: 600,
          customerId: '...',
        },
        {
          value: 70,
          latency: 250,
          customerId: '...',
        },
        {
          value: 200,
          latency: 850,
          customerId: '...',
        },
        
      ];
      const apiKey = 'test-api-key';

      const transactionSpy = jest.spyOn(service, 'transaction');
      await controller.Transaction(transactionDto, apiKey);

      expect(transactionSpy).toHaveBeenCalledWith(transactionDto, apiKey);
    });
  });

  describe('getCustomer', () => {
    it('should call WalletApiService.getCustomerById with the correct parameters', async () => {
      const id = 'test-id';
      const apiKey = 'test-api-key';

      const getCustomerByIdSpy = jest.spyOn(service, 'getCustomerById');
      await controller.getCustomer(id, apiKey);

      expect(getCustomerByIdSpy).toHaveBeenCalledWith(id, apiKey);
    });
  });

  describe('deleteCustomer', () => {
    it('should call WalletApiService.deleteCustomerById with the correct parameters', async () => {
      const id = 'test-id';

      const deleteCustomerByIdSpy = jest.spyOn(service, 'deleteCustomerById');
      await controller.deleteCustomer(id);

      expect(deleteCustomerByIdSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('updateCustomer', () => {
    it('should call WalletApiService.updateCustomerById with the correct parameters', async () => {
      const id = 'test-id';
      const customerData = {
        first_name: 'John',
        last_name: 'Doe',
        balance: 500,
      };

      const updateCustomerByIdSpy = jest.spyOn(service, 'updateCustomerById');
      await controller.updateCustomer(id, customerData);

      expect(updateCustomerByIdSpy).toHaveBeenCalledWith(id, customerData);
    });
  });
});
