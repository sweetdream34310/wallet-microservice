import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  db: {
    mongoBaseUri: process.env.MONGODB_URI as string,
    dbName: process.env.DB_NAME as string,
  },
};

export const jwtConstants = {
  secret: 'secretKey',
};

export const baseUrl = "http://127.0.0.1";

export const walletProcessorPort = 8080;
