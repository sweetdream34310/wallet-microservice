import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../models/customer.schema';
import axios from 'axios';
import mongoose from 'mongoose';

@Injectable()
export class SeedService {
  private isSeeding: boolean = false;

  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async seedFromS3(): Promise<void> {
    try {
      let count = 0;

      if (this.isSeeding) {
        console.log('Seeding already in progress');
        return;
      }

      this.isSeeding = true;
      console.log('Starting seeding process');

      const response = await axios.get(
        'https://s3.eu-central-1.amazonaws.com/nt-interview-files/data.json',
        { responseType: 'stream' },
      );

      const chunkSize = 1000;
      let customers = [];
      let buffer = '';

      response.data.on('data', (data) => {
        buffer += data;

        while (buffer.length > 0) {
          const endIndex = buffer.indexOf('\n') + 1;

          if (endIndex <= 0) {
            break;
          }

          const line = buffer.slice(0, endIndex);
          buffer = buffer.slice(endIndex);

          const customer = JSON.parse(line);
          const { _id, date_of_birth, createdAt, updatedAt, ...rest } =
            customer;

          let dob;
          if (
            typeof date_of_birth === 'string' &&
            !isNaN(Date.parse(date_of_birth))
          ) {
            dob = new Date(date_of_birth);
          } else if (
            date_of_birth &&
            typeof date_of_birth['$date'] === 'string' &&
            !isNaN(Date.parse(date_of_birth['$date']))
          ) {
            dob = new Date(date_of_birth['$date']);
          } else {
            return;
          }

          customers.push({
            ...rest,
            _id: new mongoose.Types.ObjectId(_id['$oid']),
            date_of_birth: dob,
            createdAt: new Date(createdAt['$date']),
            updatedAt: new Date(updatedAt['$date']),
          });

          if (customers.length >= chunkSize) {
            console.log(`--------current data size is ${buffer.length} ------------`)
            this.customerModel.insertMany(customers);
            customers = [];
          }

          // count++;

          // if (count >= chunkSize) {
          //   response.data.destroy();
          // }
        }
      });

      response.data.on('end', () => {
        if (customers.length > 0) {
          this.customerModel.insertMany(customers);
        }
        console.log('Seeding process complete');
        this.isSeeding = false;
      });

      response.data.on('error', (err) => {
        console.error('Error reading data stream:', err);
        this.isSeeding = false;
      });
    } catch (err) {
      console.error('Error seeding from S3:', err);
      this.isSeeding = false;
    }
  }
}
