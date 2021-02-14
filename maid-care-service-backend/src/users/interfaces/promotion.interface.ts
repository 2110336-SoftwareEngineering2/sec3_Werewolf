import { Document } from 'mongoose';

export interface Promotion extends Document{
  creater: string;
  description: string;
  availableDate: Date;
  expiredDate: Date;
}