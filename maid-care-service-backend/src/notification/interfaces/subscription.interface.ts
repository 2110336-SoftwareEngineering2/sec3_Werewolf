import { Document } from 'mongoose';

export interface Subscription extends Document {
  endpoint: string;
  expirationTime: number;
  keys: {
    auth: string;
    p256dh: string;
  };
}
