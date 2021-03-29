import { Document } from 'mongoose';
import { Work } from '../dto/job.dto';

export interface Job extends Document {
  _id: string;
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
  photos: string[];
}
