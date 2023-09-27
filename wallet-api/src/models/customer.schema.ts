import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  _id!: Types.ObjectId;

  @Prop({ required: true })
  uid!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  first_name!: string;

  @Prop({ required: true })
  last_name!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  gender!: string;

  @Prop({ required: true })
  phone_number!: string;

  @Prop({ required: true })
  social_insurance_number!: string;

  @Prop({ required: true })
  avatar!: string;

  @Prop({ required: true })
  date_of_birth!: Date;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true, type: Object })
  employment!: {
    title: string;
    key_skill: string;
  };

  @Prop({ required: true, type: Object })
  credit_card!: {
    ballance: number;
    cc_number: string;
  };

  @Prop({ required: true, type: Object })
  address!: {
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
    state: string;
    street_address: string;
    street_name: string;
    zip_code: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
