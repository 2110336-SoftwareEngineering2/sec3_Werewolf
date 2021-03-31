import { Document } from 'mongoose';

export interface Refund extends Document {
  customerId: string;
  jobId: string;
  description: string;
  createDate: Date;
}
