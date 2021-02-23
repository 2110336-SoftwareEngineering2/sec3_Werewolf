import { Document } from 'mongoose';

export interface Promotion extends Document {
  code: string;
  creater: string;
  description: string;
  discountRate: number;
  availableDate: Date;
  expiredDate: Date;
}
