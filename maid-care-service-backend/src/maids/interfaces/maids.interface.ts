import { Document } from 'mongoose';

export interface Maid extends Document {
  avgRating: number;
  totalReviews: number;
}
