import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { TransactionDto } from '../../wallet-api/dto/transaction.dto/transaction.dto'

describe('WalletApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet-api/transaction (POST)', () => {
    it('should return 201 status code', async () => {
      const transactionDto: TransactionDto[] = [
        {
          value: 110,
          latency: 600,
          customerId: 'test-id',
        },
        {
          value: 70,
          latency: 250,
          customerId: 'test-id',
        },
        {
          value: 200,
          latency: 850,
          customerId: 'test-id',
        },
      ];
      const apiKey = process.env.API_KEY;

      const response = await request(app.getHttpServer())
        .post('/wallet-api/transaction')
        .send(transactionDto)
        .set('X-API-KEY', apiKey);

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return 401 status code for invalid API key', async () => {
      const transactionDto: TransactionDto[] = [
        {
          value: 110,
          latency: 600,
          customerId: 'test-id',
        },
        {
          value: 70,
          latency: 250,
          customerId: 'test-id',
        },
        {
          value: 200,
          latency: 850,
          customerId: 'test-id',
        },
      ];
      const apiKey = 'invalid-api-key';

      const response = await request(app.getHttpServer())
        .post('/wallet-api/transaction')
        .send(transactionDto)
        .set('X-API-KEY', apiKey);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/wallet-api/customer/:id (GET)', () => {
    it('should return 200 status code and customer data', async () => {
      const id = 'test-id';
      const apiKey = process.env.API_KEY;

      const response = await request(app.getHttpServer())
        .get(`/wallet-api/customer/${id}`)
        .set('X-API-KEY', apiKey);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id,
        first_name: 'John',
        last_name: 'Doe',
        balance: 500,
      });
    });

    it('should return 401 status code for invalid API key', async () => {
      const id = 'test-id';
      const apiKey = 'invalid-api-key';

      const response = await request(app.getHttpServer())
        .get(`/wallet-api/customer/${id}`)
        .set('X-API-KEY', apiKey);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 status code for non-existent customer', async () => {
      const id = 'non-existent-id';
      const apiKey = process.env.API_KEY;

      const response = await request(app.getHttpServer())
        .get(`/wallet-api/customer/${id}`)
        .set('X-API-KEY', apiKey);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('/wallet-api/customer/:id (DELETE)', () => {
    it('should return 204 status code', async () => {
      const id = 'test-id';

      const response = await request(app.getHttpServer())
        .delete(`/wallet-api/customer/${id}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('should return 404 status code for non-existent customer', async () => {
      const id = 'non-existent-id';

      const response = await request(app.getHttpServer())
        .delete(`/wallet-api/customer/${id}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('/wallet-api/customer/:id (PUT)', () => {
    it('should return 200 status code and updated customer data', async () => {
      const id = 'test-id';
      const customerData = {
        first_name: 'Jane',
        last_name: 'Doe',
        balance: 1000,
      };

      const response = await request(app.getHttpServer())
        .put(`/wallet-api/customer/${id}`)
        .send(customerData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id,
        ...customerData,
      });
    });

    it('should return 404 status code for non-existent customer', async () => {
      const id = 'non-existent-id';
      const customerData = {
        first_name: 'Jane',
        last_name: 'Doe',
        balance: 1000,
      };

      const response = await request(app.getHttpServer())
        .put(`/wallet-api/customer/${id}`)
        .send(customerData);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
