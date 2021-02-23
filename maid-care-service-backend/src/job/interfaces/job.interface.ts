import { Document } from 'mongoose';

export interface Job extends Document {
  customerId: string;
  maidId: string;
  workplaceId: string;
}
