import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UnsuccessfulTransactionDocument =
  HydratedDocument<UnsuccessfulTransaction> & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class UnsuccessfulTransaction extends Document {
  @Prop({ required: true, type: Object })
  transaction!: {
    value: number;
    latency: number;
    customerId: Types.ObjectId;
  };

  @Prop({ required: true })
  reason!: string;

  @Prop({ required : false})
  retryAfter: Date;
}

export const UnsuccessfulTransactionSchema = SchemaFactory.createForClass(
  UnsuccessfulTransaction,
);
