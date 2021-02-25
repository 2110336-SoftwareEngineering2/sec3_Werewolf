import { Document } from 'mongoose';
import { Work } from '../work';

export interface Job extends Document {
  customerId: string;
  maidId: string;
  workplaceId: string;
  work: [Work];
}
