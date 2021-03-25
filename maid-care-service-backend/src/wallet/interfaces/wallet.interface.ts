import { Document } from 'mongoose';

export interface Wallet extends Document {
  g_coin: number;
}
