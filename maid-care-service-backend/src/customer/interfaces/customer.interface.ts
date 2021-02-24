import { Document } from 'mongoose';

export interface Customer extends Document {
  g_coin: number;
}
