import { Document } from 'mongoose';

export interface Promotion extends Document {
  code: string;
  creater: string;
  description: string;
  availableDate: Date;
  expiredDate: Date;
}
