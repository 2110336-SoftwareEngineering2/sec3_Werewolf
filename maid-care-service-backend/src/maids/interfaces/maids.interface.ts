import { Document } from 'mongoose';

export interface Maid extends Document {
  work: [string];
  avgRating: number;
  totalReviews: number;
  availability: boolean;
}
