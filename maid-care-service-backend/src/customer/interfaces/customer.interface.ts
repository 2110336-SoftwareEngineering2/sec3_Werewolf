import { Document } from 'mongoose';

export interface Customer extends Document {
  email: string;
  g_coin: number;
}
