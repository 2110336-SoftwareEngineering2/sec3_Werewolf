import { Document } from 'mongoose';
import { Work } from '../dto/job.dto';

export interface Job extends Document {
  customerId: string;
  workplaceId: string;
  work: [Work];
  cost: number;
  maidId: string;
  requestedMaid: [string];
  expiryTime: Date;
  state: string;
  rating: number;
  review: string;
}
