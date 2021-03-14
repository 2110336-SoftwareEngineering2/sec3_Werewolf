import { Document } from 'mongoose';
import { Work } from '../dto/create-job.dto';

export interface Job extends Document {
  customerId: string;
  workplaceId: string;
  work: [Work];
  maidId: string;
  requestedMaid: [string];
  expiryTime: Date;
}
